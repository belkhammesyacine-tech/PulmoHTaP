// features/chat/chat.routes.js
import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import * as ctrl from './chat.controller.js';

const router = Router();
router.use(authenticate);

router.get('/contacts',       ctrl.getContacts);
router.get('/unread',         ctrl.getUnreadCount);
router.get('/:userId',        ctrl.getMessages);

export default router;
