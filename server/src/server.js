// server.js — HTTP server entry point
import 'dotenv/config';
import app from './app.js';
import prisma from './core/lib/prisma.js';
import { logger } from './core/lib/logger.js';

const PORT = Number(process.env.PORT ?? 5000);

// ── IMP-1: Startup ENV validation ─────────────────
const REQUIRED_ENV = [
  'DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET',
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[STARTUP] متغيرات البيئة التالية مفقودة: ${missing.join(', ')}`);
  process.exit(1);
}

async function main() {
  // Verify DB connection before accepting requests
  await prisma.$connect();
  logger.info({ action: 'DB_CONNECTED' });

  app.listen(PORT, () => {
    logger.info({ action: 'SERVER_STARTED', port: PORT, env: process.env.NODE_ENV });
  });
}

main().catch((err) => {
  logger.error({ action: 'STARTUP_FAILED', err: err.message });
  process.exit(1);
});

// Graceful shutdown — BUG-4: handle both SIGTERM (Docker) and SIGINT (Ctrl+C)
async function shutdown(signal) {
  logger.info({ action: 'SERVER_SHUTDOWN', signal });
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

