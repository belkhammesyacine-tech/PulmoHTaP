// features/chat/chat.socket.js
import jwt from 'jsonwebtoken';
import { saveMessage } from './chat.service.js';
import { logger } from '../../core/lib/logger.js';

// Map: userId -> Set<socketId> (user can have multiple tabs open)
const onlineUsers = new Map();

export function initChatSocket(io) {
  // Middleware: Authenticate socket connection using JWT from handshake auth
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: no token provided'));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId   = payload.sub;
      socket.fullName = payload.fullName;
      next();
    } catch {
      next(new Error('Authentication error: invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    logger.info({ action: 'SOCKET_CONNECT', userId, socketId: socket.id });

    // Track online users
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    // Join a personal room so we can send to this user by userId
    socket.join(`user:${userId}`);

    // Broadcast to all that this user is online
    io.emit('user:online', { userId });

    // ── Event: Send a message ──────────────────────────────────
    socket.on('message:send', async ({ receiverId, content }) => {
      if (!receiverId || !content?.trim()) return;

      try {
        const message = await saveMessage(userId, receiverId, content.trim());

        // Emit to receiver's personal room
        io.to(`user:${receiverId}`).emit('message:receive', message);

        // Emit back to sender (for multi-tab sync)
        socket.emit('message:sent', message);
      } catch (err) {
        logger.error({ action: 'SOCKET_MESSAGE_ERROR', err: err.message });
        socket.emit('message:error', { error: 'فشل في إرسال الرسالة' });
      }
    });

    // ── Event: Typing indicator ────────────────────────────────
    socket.on('typing:start', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:start', { senderId: userId });
    });

    socket.on('typing:stop', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:stop', { senderId: userId });
    });

    // ── Event: Disconnect ──────────────────────────────────────
    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit('user:offline', { userId });
        }
      }
      logger.info({ action: 'SOCKET_DISCONNECT', userId, socketId: socket.id });
    });
  });
}

export const isUserOnline = (userId) => onlineUsers.has(userId);
