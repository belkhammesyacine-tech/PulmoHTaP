// features/users/doctors.routes.js — Public doctors search endpoint
import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import * as ctrl from './users.controller.js';

const router = Router();

// Public — any authenticated user can search for doctors
router.use(authenticate);
router.get('/', ctrl.getDoctors);

export default router;
