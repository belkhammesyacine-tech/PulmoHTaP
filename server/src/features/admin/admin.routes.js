// features/admin/admin.routes.js
import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import { authorize } from '../../core/middleware/authorize.js';
import { validate } from '../../core/middleware/validate.js';
import { z } from 'zod';
import * as ctrl from './admin.controller.js';

const router = Router();

// Only PLATFORM_ADMIN can access these routes
router.use(authenticate, authorize(['PLATFORM_ADMIN', 'CLINIC_ADMIN']));

const reviewSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().optional()
});

router.get('/verifications/pending', ctrl.getPendingVerifications);
router.put('/verifications/:id/review', validate(reviewSchema), ctrl.reviewVerification);
router.get('/stats', ctrl.getStats);

export default router;

