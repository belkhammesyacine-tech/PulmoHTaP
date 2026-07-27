// features/auth/auth.schema.js — Zod validation schemas
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
  .regex(/[0-9]/, 'يجب أن تحتوي على رقم');

const phoneSchema = z
  .string()
  .regex(/^(\+213|0)(5|6|7)\d{8}$/, 'رقم الهاتف الجزائري غير صحيح');

const AccountTypes = [
  'PATIENT', 'DOCTOR', 'SPECIALIST', 'LABORATORY',
  'PHARMACY', 'PSYCHOLOGIST', 'RESEARCHER', 'CLINIC_ADMIN', 'PLATFORM_ADMIN',
];

export const registerSchema = z.object({
  fullName:    z.string().min(3, 'الاسم الكامل يجب أن يكون 3 أحرف على الأقل').max(100),
  email:       z.string().email('البريد الإلكتروني غير صحيح').toLowerCase(),
  phone:       phoneSchema,
  password:    passwordSchema,
  accountType: z.enum(AccountTypes, { error: 'نوع الحساب غير صحيح' }),
});

export const loginSchema = z.object({
  email:    z.string().email('البريد الإلكتروني غير صحيح').toLowerCase(),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح').toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token:    z.string().min(1, 'الرمز مطلوب'),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword:     passwordSchema,
});
