// features/notifications/notifications.service.js
import prisma from '../../core/lib/prisma.js';
import { logger } from '../../core/lib/logger.js';

export async function getNotifications(userId, { limit = 20 } = {}) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  const unreadCount = await prisma.notification.count({ where: { userId, isRead: false } });
  return { notifications, unreadCount };
}

export async function markAsRead(userId, notificationId) {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data:  { isRead: true },
  });
}

export async function markAllAsRead(userId) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data:  { isRead: true },
  });
}

export async function createNotification(userId, { title, body, type = 'INFO', link } = {}) {
  const notif = await prisma.notification.create({
    data: { userId, title, body, type, link },
  });
  logger.info({ action: 'CREATE_NOTIFICATION', userId, type });
  return notif;
}
