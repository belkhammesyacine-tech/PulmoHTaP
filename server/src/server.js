// server.js — HTTP + WebSocket server entry point
import 'dotenv/config';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import prisma from './core/lib/prisma.js';
import { logger } from './core/lib/logger.js';
import { initChatSocket } from './features/chat/chat.socket.js';

const PORT = Number(process.env.PORT ?? 5000);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

async function main() {
  // Verify DB connection before accepting requests
  await prisma.$connect();
  logger.info({ action: 'DB_CONNECTED' });

  // Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // Attach Socket.io to the same HTTP server
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: CLIENT_URL,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Initialize chat socket handlers
  initChatSocket(io);

  httpServer.listen(PORT, () => {
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

