// core/errors/AppError.js — Typed application error
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export const Err = {
  badRequest: (msg, code) => new AppError(msg, 400, code ?? 'BAD_REQUEST'),
  unauthorized: (msg)     => new AppError(msg ?? 'غير مصرح', 401, 'UNAUTHORIZED'),
  forbidden: (msg)        => new AppError(msg ?? 'ممنوع', 403, 'FORBIDDEN'),
  notFound: (msg)         => new AppError(msg ?? 'غير موجود', 404, 'NOT_FOUND'),
  conflict: (msg, code)   => new AppError(msg, 409, code ?? 'CONFLICT'),
  tooMany: (msg)          => new AppError(msg ?? 'محاولات كثيرة، حاول لاحقاً', 429, 'TOO_MANY_REQUESTS'),
};
