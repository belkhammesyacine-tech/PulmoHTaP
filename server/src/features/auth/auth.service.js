// features/auth/auth.service.js — Business logic for authentication
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '../../core/lib/prisma.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../core/lib/token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../core/lib/email.js';
import { logger } from '../../core/lib/logger.js';
import { Err } from '../../core/errors/AppError.js';

const BCRYPT_ROUNDS = 12;
const VERIFICATION_EXPIRES_HOURS = 24;
const RESET_EXPIRES_HOURS = 1;
const REFRESH_EXPIRES_DAYS = 7;

// ── Helpers ────────────────────────────────────────────────

function secureToken() {
  return crypto.randomBytes(32).toString('hex');
}

function addHours(h) {
  return new Date(Date.now() + h * 60 * 60 * 1000);
}

function addDays(d) {
  return new Date(Date.now() + d * 24 * 60 * 60 * 1000);
}

function safeUser(user) {
  // Never send passwordHash to client
  const { passwordHash, ...safe } = user;
  return safe;
}

async function writeAuditLog(action, userId, meta) {
  // Fire-and-forget — non-blocking
  prisma.auditLog.create({ data: { action, userId: userId ?? null, metadata: meta ?? null } })
    .catch((e) => logger.error({ action: 'AUDIT_LOG_FAILED', err: e.message }));
}

// ── Public Service Methods ─────────────────────────────────

export async function register({ fullName, email, phone, password, accountType }, meta) {
  // 1. Check duplicates
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
    select: { email: true, phone: true },
  });

  if (existing?.email === email) throw Err.conflict('البريد الإلكتروني مستخدم بالفعل', 'EMAIL_TAKEN');
  if (existing?.phone === phone) throw Err.conflict('رقم الهاتف مستخدم بالفعل', 'PHONE_TAKEN');

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // 3. Create user + profile + verification token in one transaction
  const token = secureToken();
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        fullName, email, phone, passwordHash, accountType,
        profile: { create: {} },
        emailVerifications: {
          create: { token, expiresAt: addHours(VERIFICATION_EXPIRES_HOURS) },
        },
      },
    });
    return created;
  });

  // 4. Send verification email (async, don't block response)
  sendVerificationEmail(email, token).catch((e) =>
    logger.error({ action: 'VERIFICATION_EMAIL_FAILED', userId: user.id, err: e.message })
  );

  writeAuditLog('REGISTER', user.id, meta);
  logger.info({ action: 'REGISTER', userId: user.id, accountType });
  return safeUser(user);
}

export async function verifyEmail(token) {
  const record = await prisma.emailVerification.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) throw Err.badRequest('رابط التحقق غير صالح', 'INVALID_TOKEN');
  if (record.expiresAt < new Date()) throw Err.badRequest('انتهت صلاحية رابط التحقق', 'TOKEN_EXPIRED');
  if (record.user.status === 'ACTIVE') throw Err.badRequest('الحساب مُفعَّل بالفعل', 'ALREADY_VERIFIED');

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { status: 'ACTIVE' } }),
    prisma.emailVerification.delete({ where: { token } }),
  ]);

  writeAuditLog('VERIFY_EMAIL', record.userId, null);
  logger.info({ action: 'VERIFY_EMAIL', userId: record.userId });
}

export async function login({ email, password }, deviceInfo, ipAddress, userAgent) {
  // 1. Find user
  const user = await prisma.user.findUnique({ where: { email } });

  // 2. Guard against timing attacks — always compare even if user not found
  const passwordToCompare = user?.passwordHash ?? '$2b$12$invalidhashfortimingprotection';
  const isValid = await bcrypt.compare(password, passwordToCompare);

  if (!user || !isValid) {
    writeAuditLog('FAILED_LOGIN', user?.id, { email, ipAddress });
    logger.warn({ action: 'FAILED_LOGIN', email, ipAddress });
    throw Err.unauthorized('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  if (user.status === 'PENDING') throw Err.unauthorized('يُرجى تفعيل حسابك عبر البريد الإلكتروني', 'ACCOUNT_PENDING');
  if (user.status === 'SUSPENDED') throw Err.unauthorized('تم تعليق هذا الحساب، تواصل مع الدعم', 'ACCOUNT_SUSPENDED');
  if (user.status === 'DELETED') throw Err.unauthorized('هذا الحساب غير موجود', 'ACCOUNT_DELETED');

  // 3. Generate tokens
  const payload = { sub: user.id, type: user.accountType };
  const accessToken = signAccessToken(payload);
  const refreshTokenValue = signRefreshToken(payload);

  // 4. Store session
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: refreshTokenValue,
      deviceInfo, ipAddress, userAgent,
      expiresAt: addDays(REFRESH_EXPIRES_DAYS),
    },
  });

  // 5. Update lastLoginAt (non-blocking)
  prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
    .catch(() => {});

  writeAuditLog('LOGIN', user.id, { ipAddress, deviceInfo });
  logger.info({ action: 'LOGIN', userId: user.id });

  return { accessToken, refreshToken: refreshTokenValue, user: safeUser(user) };
}

export async function refresh(rawRefreshToken) {
  // 1. Verify JWT signature
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw Err.unauthorized('انتهت صلاحية الجلسة');
  }

  // 2. Find session in DB
  const session = await prisma.session.findUnique({ where: { refreshToken: rawRefreshToken } });
  if (!session || session.status !== 'ACTIVE') throw Err.unauthorized('الجلسة غير صالحة');
  if (session.expiresAt < new Date()) {
    await prisma.session.update({ where: { id: session.id }, data: { status: 'EXPIRED' } });
    throw Err.unauthorized('انتهت صلاحية الجلسة، يُرجى تسجيل الدخول مجدداً');
  }

  // 3. Issue new access token
  const accessToken = signAccessToken({ sub: payload.sub, type: payload.type });

  // Update lastUsedAt (non-blocking)
  prisma.session.update({ where: { id: session.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});

  return { accessToken };
}

export async function logout(rawRefreshToken) {
  if (!rawRefreshToken) return;
  await prisma.session.updateMany({
    where: { refreshToken: rawRefreshToken, status: 'ACTIVE' },
    data: { status: 'REVOKED' },
  });
  logger.info({ action: 'LOGOUT' });
}

export async function forgotPassword({ email }, meta) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, status: true } });

  // 🟢 التعديل: استثناء الحسابات المعلقة والمحذوفة فقط والسماح للحسابات الـ PENDING بالاستعادة
  if (!user || user.status === 'SUSPENDED' || user.status === 'DELETED') {
    logger.warn({ action: 'FORGOT_PASSWORD_UNKNOWN_EMAIL', email });
    return;
  }
  const token = secureToken();

  // Invalidate previous tokens
  await prisma.passwordReset.updateMany({ where: { userId: user.id, used: false }, data: { used: true } });

  await prisma.passwordReset.create({
    data: { userId: user.id, token, expiresAt: addHours(RESET_EXPIRES_HOURS) },
  });

  sendPasswordResetEmail(email, token).catch((e) =>
    logger.error({ action: 'RESET_EMAIL_FAILED', userId: user.id, err: e.message })
  );

  writeAuditLog('FORGOT_PASSWORD', user.id, meta);
}

export async function resetPassword({ token, password }) {
  const record = await prisma.passwordReset.findUnique({ where: { token }, include: { user: true } });

  if (!record || record.used) throw Err.badRequest('الرابط غير صالح أو مستخدم بالفعل', 'INVALID_TOKEN');
  if (record.expiresAt < new Date()) throw Err.badRequest('انتهت صلاحية الرابط', 'TOKEN_EXPIRED');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordReset.update({ where: { token }, data: { used: true } }),
    // Revoke all sessions on password reset
    prisma.session.updateMany({ where: { userId: record.userId }, data: { status: 'REVOKED' } }),
  ]);

  writeAuditLog('PASSWORD_RESET', record.userId, null);
  logger.info({ action: 'PASSWORD_RESET', userId: record.userId });
}
