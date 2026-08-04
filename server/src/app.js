// app.js — Express application setup (M6: Security hardening)
import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './core/middleware/rateLimiter.js';
import { AppError } from './core/errors/AppError.js';
import { logger } from './core/lib/logger.js';
import authRoutes from './features/auth/auth.routes.js';
import usersRoutes from './features/users/users.routes.js';

const app = express();

// ── Security Middleware (M6) ───────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true, // Required for HttpOnly cookies
}));

// ── IMP-4: Request Correlation ID ──────────────
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// ── Parsing ────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// ── Rate Limiting ──────────────────────────────
app.use('/api', apiLimiter);

// ── Health Check ───────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'PulmoHTapAlgérie API', ts: new Date().toISOString() });
});

// ── Routes ─────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/users/me', usersRoutes);

// ── 404 Handler ────────────────────────────────
app.use((_req, _res, next) => {
  next(new AppError('المسار غير موجود', 404, 'NOT_FOUND'));
});

// ── Global Error Handler ───────────────────────
app.use((err, _req, res, _next) => {
  const status  = err.statusCode ?? 500;
  const code    = err.code ?? 'INTERNAL_ERROR';
  const message = err.isOperational ? err.message : 'خطأ داخلي في الخادم';

  if (status >= 500) {
    logger.error({ code, err: err.message, stack: err.stack });
  } else {
    logger.warn({ code, message: err.message });
  }

  res.status(status).json({ error: message, code });
});

export default app;
