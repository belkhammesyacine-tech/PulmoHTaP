// features/admin/admin.controller.js
import * as adminService from './admin.service.js';

export async function getPendingVerifications(req, res, next) {
  try {
    const verifications = await adminService.getPendingVerifications();
    res.json({ verifications });
  } catch (err) { next(err); }
}

export async function reviewVerification(req, res, next) {
  try {
    const verification = await adminService.reviewVerification(
      req.user.sub,
      req.params.id,
      req.body
    );
    res.json({ message: 'تم حفظ قرار المراجعة بنجاح', verification });
  } catch (err) { next(err); }
}

export async function getStats(req, res, next) {
  try {
    const stats = await adminService.getStats();
    res.json({ stats });
  } catch (err) { next(err); }
}
