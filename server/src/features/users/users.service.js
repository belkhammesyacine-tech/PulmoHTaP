// features/users/users.service.js — User management business logic
import bcrypt from 'bcryptjs';
import prisma from '../../core/lib/prisma.js';
import { logger } from '../../core/lib/logger.js';
import { Err } from '../../core/errors/AppError.js';

const BCRYPT_ROUNDS = 12;

function safeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true, doctorVerification: true },
  });
  if (!user) throw Err.notFound('المستخدم غير موجود');
  return safeUser(user);
}

export async function updateProfile(userId, data) {
  const { fullName, phone, profile: profileData } = data;

  // Check phone uniqueness if changed
  if (phone) {
    const existing = await prisma.user.findFirst({
      where: { phone, NOT: { id: userId } },
      select: { id: true },
    });
    if (existing) throw Err.conflict('رقم الهاتف مستخدم بالفعل', 'PHONE_TAKEN');
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(profileData && {
        profile: { update: profileData },
      }),
    },
    include: { profile: true },
  });

  logger.info({ action: 'UPDATE_PROFILE', userId });
  return safeUser(user);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) throw Err.unauthorized('كلمة المرور الحالية غير صحيحة');

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  logger.info({ action: 'CHANGE_PASSWORD', userId });
}

export async function getSessions(userId) {
  return prisma.session.findMany({
    where: { userId, status: 'ACTIVE' },
    select: { id: true, deviceInfo: true, ipAddress: true, createdAt: true, lastUsedAt: true },
    orderBy: { lastUsedAt: 'desc' },
  });
}

export async function revokeAllSessions(userId, exceptToken) {
  const where = { userId, status: 'ACTIVE' };
  if (exceptToken) where.refreshToken = { not: exceptToken };

  await prisma.session.updateMany({ where, data: { status: 'REVOKED' } });
  logger.info({ action: 'REVOKE_ALL_SESSIONS', userId });
}

export async function revokeSession(userId, sessionId) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== userId) throw Err.notFound('الجلسة غير موجودة');

  await prisma.session.update({ where: { id: sessionId }, data: { status: 'REVOKED' } });
  logger.info({ action: 'REVOKE_SESSION', userId, sessionId });
}
