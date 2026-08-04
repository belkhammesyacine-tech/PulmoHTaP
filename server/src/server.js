// server.js — HTTP server entry point
import 'dotenv/config';
import app from './app.js';
import prisma from './core/lib/prisma.js';
import { logger } from './core/lib/logger.js';

const PORT = Number(process.env.PORT ?? 5000);

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

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  logger.info({ action: 'SERVER_SHUTDOWN' });
  process.exit(0);
});