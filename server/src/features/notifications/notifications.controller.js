// features/notifications/notifications.controller.js
import * as svc from './notifications.service.js';

export async function getNotifications(req, res, next) {
  try {
    const data = await svc.getNotifications(req.user.sub);
    res.json(data);
  } catch (err) { next(err); }
}

export async function markAsRead(req, res, next) {
  try {
    await svc.markAsRead(req.user.sub, req.params.id);
    res.json({ message: 'تم التحديد كمقروء' });
  } catch (err) { next(err); }
}

export async function markAllAsRead(req, res, next) {
  try {
    await svc.markAllAsRead(req.user.sub);
    res.json({ message: 'تم تحديد الكل كمقروء' });
  } catch (err) { next(err); }
}
