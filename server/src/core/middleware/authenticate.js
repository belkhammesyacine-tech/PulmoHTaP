// core/middleware/authenticate.js — JWT Bearer token verification
import { verifyAccessToken } from '../lib/token.js';
import { Err } from '../errors/AppError.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(Err.unauthorized('يُرجى تسجيل الدخول أولاً'));

  const token = header.slice(7);
  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      ...decoded,
      id: decoded.sub ?? decoded.id,
      sub: decoded.sub ?? decoded.id,
      accountType: decoded.type ?? decoded.accountType,
      type: decoded.type ?? decoded.accountType,
    };
    next();
  } catch {
    next(Err.unauthorized('انتهت صلاحية الجلسة، يُرجى تسجيل الدخول مجدداً'));
  }
}
