// server/src/features/records/records.schema.js
import { z } from 'zod';

export const createRecordSchema = z.object({
  patientId: z.string().min(1, 'معرف المريض مطلوب'),
  type: z.enum(['DIAGNOSIS', 'PRESCRIPTION', 'LAB_TEST', 'XRAY', 'GENERAL_NOTE'], {
    errorMap: () => ({ message: 'نوع السجل غير صالح' })
  }),
  title: z.string().min(2, 'العنوان قصير جداً'),
  description: z.string().min(5, 'الوصف مطلوب'),
  attachment: z.string().optional(),
});

export const updateRecordSchema = z.object({
  title: z.string().min(2, 'العنوان قصير جداً').optional(),
  description: z.string().min(5, 'الوصف مطلوب').optional(),
});
