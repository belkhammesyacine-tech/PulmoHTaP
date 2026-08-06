import { Err } from '../errors/AppError.js';

export function authorize(allowedRoles = []) {
  return (req, res, next) => {
    // التأكد من وجود المستخدم المستخرج من authenticate middleware
    if (!req.user) {
      return next(Err.unauthorized('غير مصرح بالدخول'));
    }

    // إذا كان الدور الخاطئ أو غير مجاز
    if (allowedRoles.length && !allowedRoles.includes(req.user.accountType)) {
      return next(Err.forbidden('ليس لديك الصلاحيات الكافية للوصول لهذا العنصر'));
    }

    next();
  };
}