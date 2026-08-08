// features/users/users.routes.js
import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import { validate } from '../../core/middleware/validate.js';
import { z } from 'zod';
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

const submitVerificationSchema = z.object({
  licenseNumber: z.string().min(3),
  specialty: z.string().optional(),
  institution: z.string().optional(),
  documentUrl: z.string().url().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8)
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم'),
});

router.get('/',                                 ctrl.getMe);
router.patch('/',          validate(updateProfileSchema), ctrl.updateProfile);
router.patch('/password',  validate(changePasswordSchema), ctrl.changePassword);
router.get('/sessions',                         ctrl.getSessions);
router.delete('/sessions',                      ctrl.revokeAllSessions);
router.delete('/sessions/:sessionId',           ctrl.revokeSession);

// Verification routes
router.post('/verification', validate(submitVerificationSchema), ctrl.submitVerification);

export default router;
