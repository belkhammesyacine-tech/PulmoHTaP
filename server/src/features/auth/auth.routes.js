// features/auth/auth.routes.js — Auth router
import { Router } from 'express';
import { authLimiter } from '../../core/middleware/rateLimiter.js';
import { validate } from '../../core/middleware/validate.js';
import {
  registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema,
} from './auth.schema.js';
import * as ctrl from './auth.controller.js';

const router = Router();

router.post('/register',        authLimiter, validate(registerSchema),        ctrl.register);
router.get('/verify-email',                                                    ctrl.verifyEmail);
router.post('/login',           authLimiter, validate(loginSchema),            ctrl.login);
router.post('/refresh',                                                        ctrl.refresh);
router.post('/logout',                                                         ctrl.logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema),   ctrl.forgotPassword);
router.post('/reset-password',  authLimiter, validate(resetPasswordSchema),    ctrl.resetPassword);

export default router;
