// core/middleware/authenticate.js — JWT Bearer token verification
import { verifyAccessToken } from '../lib/token.js';
import { Err } from '../errors/AppError.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(Err.unauthorized('يُرجى تسجيل الدخول أولاً'));

  const token = header.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(Err.unauthorized('انتهت صلاحية الجلسة، يُرجى تسجيل الدخول مجدداً'));
  }
}
