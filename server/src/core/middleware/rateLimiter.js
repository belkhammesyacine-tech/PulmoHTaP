// core/middleware/rateLimiter.js — Brute-force protection
import { rateLimit } from 'express-rate-limit';

// Strict limiter for auth routes (login, register, forgot-password)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'محاولات كثيرة، يُرجى المحاولة بعد 15 دقيقة', code: 'TOO_MANY_REQUESTS' },
  skipSuccessfulRequests: true, // Only count failed requests
});

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'طلبات كثيرة، يُرجى التباطؤ', code: 'TOO_MANY_REQUESTS' },
});
