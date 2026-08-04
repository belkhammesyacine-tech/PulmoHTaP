// features/auth/auth.controller.js — HTTP handlers
import * as authService from './auth.service.js';
import { AppError } from '../../core/errors/AppError.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function getMeta(req) {
  return {
    ip: req.ip,
    userAgent: req.headers['user-agent'] ?? 'unknown',
  };
}

export async function register(req, res, next) {
  try {
    const user = await authService.register(req.body, getMeta(req));
    res.status(201).json({ message: 'تم إنشاء الحساب. يُرجى التحقق من بريدك الإلكتروني.', user });
  } catch (err) { next(err); }
}

export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) return next(new AppError('الرمز مفقود', 400, 'MISSING_TOKEN'));
    await authService.verifyEmail(token);
    res.json({ message: 'تم تفعيل الحساب بنجاح' });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { accessToken, refreshToken, user } = await authService.login(
      req.body,
      'web',                              // BUG-1 fix: deviceInfo is the client type
      req.ip,
      req.headers['user-agent'],
    );
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
    res.json({ accessToken, user });
  } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
  try {
    const rawToken = req.cookies?.refreshToken;
    if (!rawToken) return next(new AppError('الجلسة غير موجودة', 401, 'NO_SESSION'));
    const { accessToken } = await authService.refresh(rawToken);
    res.json({ accessToken });
  } catch (err) { next(err); }
}

export async function logout(req, res, next) {
  try {
    const rawToken = req.cookies?.refreshToken;
    await authService.logout(rawToken);
    res.clearCookie('refreshToken', COOKIE_OPTS);
    res.json({ message: 'تم تسجيل الخروج بنجاح' });
  } catch (err) { next(err); }
}

export async function forgotPassword(req, res, next) {
  try {
    await authService.forgotPassword(req.body, getMeta(req));
    // Always return 200 to prevent email enumeration
    res.json({ message: 'إذا كان البريد مسجلاً، ستتلقى رابط الاستعادة خلال دقائق.' });
  } catch (err) { next(err); }
}

export async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body);
    res.json({ message: 'تم تعيين كلمة المرور الجديدة بنجاح. يُرجى تسجيل الدخول.' });
  } catch (err) { next(err); }
}

export async function resendVerification(req, res, next) {
  try {
    await authService.resendVerification(req.body);
    // Always 200 — prevent email enumeration
    res.json({ message: 'إذا كان البريد مسجلاً وغير مفعَّل، ستتلقى رابط التفعيل خلال دقائق.' });
  } catch (err) { next(err); }
}
