// features/notifications/notifications.routes.js
import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import * as ctrl from './notifications.controller.js';

const router = Router();

router.use(authenticate);

router.get('/',              ctrl.getNotifications);
router.patch('/:id/read',   ctrl.markAsRead);
router.patch('/read-all',   ctrl.markAllAsRead);

export default router;
