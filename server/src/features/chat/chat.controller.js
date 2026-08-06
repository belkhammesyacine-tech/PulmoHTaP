// features/chat/chat.controller.js
import * as svc from './chat.service.js';

export async function getContacts(req, res, next) {
  try {
    const contacts = await svc.getContacts(req.user.sub);
    res.json({ contacts });
  } catch (err) { next(err); }
}

export async function getMessages(req, res, next) {
  try {
    const messages = await svc.getMessages(req.user.sub, req.params.userId);
    res.json({ messages });
  } catch (err) { next(err); }
}

export async function getUnreadCount(req, res, next) {
  try {
    const count = await svc.getUnreadCount(req.user.sub);
    res.json({ count });
  } catch (err) { next(err); }
}
