// app.js — Express application setup (M6: Security hardening)
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './core/middleware/rateLimiter.js';
import { AppError } from './core/errors/AppError.js';
import { logger } from './core/lib/logger.js';
import authRoutes from './features/auth/auth.routes.js';
import usersRoutes from './features/users/users.routes.js';
import doctorsRoutes from './features/users/doctors.routes.js';
import appointmentsRoutes from './features/appointments/appointments.routes.js';
import recordsRoutes from './features/records/records.routes.js';
import adminRoutes from './features/admin/admin.routes.js';
import notificationsRoutes from './features/notifications/notifications.routes.js';
<<<<<<< HEAD
import uploadsRoutes from './features/uploads/uploads.routes.js';
import chatRoutes from './features/chat/chat.routes.js';
=======
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d

const app = express();

// ── Security Middleware (M6) ───────────────────
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:') || origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Required for HttpOnly cookies
}));

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
app.use('/api/auth', authRoutes);
app.use('/api/users/me', usersRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);
<<<<<<< HEAD
app.use('/api/upload', uploadsRoutes);
app.use('/api/chat', chatRoutes);
=======
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d

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
