// features/users/users.routes.js
import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import { validate } from '../../core/middleware/validate.js';
import { z } from 'zod';
import { changePasswordSchema } from '../auth/auth.schema.js';
import * as ctrl from './users.controller.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

const updateProfileSchema = z.object({
  fullName: z.string().min(3).max(100).optional(),
  phone:    z.string().regex(/^(\+213|0)(5|6|7)\d{8}$/).optional(),
  profile: z.object({
    avatarUrl:       z.string().url().optional(),
    language:        z.enum(['ar', 'fr', 'en']).optional(),
    wilaya:          z.string().optional(),
    address:         z.string().max(255).optional(),
    emergencyContact: z.string().optional(),
  }).optional(),
}).strict();

router.get('/',                                 ctrl.getMe);
router.patch('/',          validate(updateProfileSchema),  ctrl.updateProfile);
router.patch('/password',  validate(changePasswordSchema), ctrl.changePassword);
router.get('/sessions',                         ctrl.getSessions);
router.delete('/sessions',                      ctrl.revokeAllSessions);
router.delete('/sessions/:sessionId',           ctrl.revokeSession);

export default router;
