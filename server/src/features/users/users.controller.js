// features/users/users.controller.js
import * as usersService from './users.service.js';

export async function getMe(req, res, next) {
  try {
    const user = await usersService.getMe(req.user.sub);
    res.json({ user });
  } catch (err) { next(err); }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await usersService.updateProfile(req.user.sub, req.body);
    res.json({ message: 'تم تحديث الملف الشخصي', user });
  } catch (err) { next(err); }
}

export async function changePassword(req, res, next) {
  try {
    await usersService.changePassword(req.user.sub, req.body);
    res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (err) { next(err); }
}

export async function getSessions(req, res, next) {
  try {
    const sessions = await usersService.getSessions(req.user.sub);
    res.json({ sessions });
  } catch (err) { next(err); }
}

export async function revokeAllSessions(req, res, next) {
  try {
    const currentToken = req.cookies?.refreshToken;
    await usersService.revokeAllSessions(req.user.sub, currentToken);
    res.json({ message: 'تم إنهاء جميع الجلسات الأخرى' });
  } catch (err) { next(err); }
}

export async function revokeSession(req, res, next) {
  try {
    await usersService.revokeSession(req.user.sub, req.params.sessionId);
    res.json({ message: 'تم إنهاء الجلسة' });
  } catch (err) { next(err); }
}

export async function submitVerification(req, res, next) {
  try {
    const verification = await usersService.submitVerification(req.user.sub, req.body);
    res.json({ message: 'تم استلام طلب التوثيق وسيتم مراجعته', verification });
  } catch (err) { next(err); }
}

export async function getDoctors(req, res, next) {
  try {
    const { wilaya, specialty, page, limit } = req.query;
    const result = await usersService.getDoctors({
      wilaya: wilaya || undefined,
      specialty: specialty || undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12,
    });
    res.json(result);
  } catch (err) { next(err); }
}

