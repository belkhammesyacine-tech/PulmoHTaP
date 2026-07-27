// core/middleware/validate.js — Zod schema validation middleware
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export function validate(schema) {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(' | ');
        return next(new AppError(messages, 400, 'VALIDATION_ERROR'));
      }
      next(err);
    }
  };
}
