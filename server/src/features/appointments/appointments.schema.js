// server/src/features/appointments/appointments.schema.js
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'معرف الطبيب مطلوب'),
  date: z.string().datetime('تاريخ الموعد غير صالح'),
  reason: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], {
    errorMap: () => ({ message: 'حالة غير صالحة' })
  }),
  notes: z.string().optional(),
});
