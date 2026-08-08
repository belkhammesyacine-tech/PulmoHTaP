// server/src/features/records/records.service.js
import prisma from '../../core/lib/prisma.js';
import { AppError } from '../../core/errors/AppError.js';

export const createRecord = async (doctorId, data) => {
  const patient = await prisma.user.findUnique({
    where: { id: data.patientId },
  });

  if (!patient || patient.accountType !== 'PATIENT') {
    throw new AppError('المريض غير موجود أو نوع الحساب غير صحيح', 400);
  }

  const record = await prisma.medicalRecord.create({
    data: {
      patientId: data.patientId,
      doctorId,
      type: data.type,
      title: data.title,
      description: data.description,
      attachment: data.attachment,
    },
  });

  return record;
};

export const getUserRecords = async (userId, userType) => {
  const isDoctor = ['DOCTOR', 'SPECIALIST'].includes(userType);

  const records = await prisma.medicalRecord.findMany({
    where: isDoctor ? { doctorId: userId } : { patientId: userId },
    include: {
      patient: { select: { id: true, fullName: true } },
      doctor: { select: { id: true, fullName: true, accountType: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return records;
};

export const getRecordById = async (userId, recordId, userType) => {
  const isDoctor = ['DOCTOR', 'SPECIALIST'].includes(userType);

  const record = await prisma.medicalRecord.findUnique({
    where: { id: recordId },
    include: {
      patient: { select: { id: true, fullName: true } },
      doctor: { select: { id: true, fullName: true, accountType: true } },
    },
  });

  if (!record) throw new AppError('السجل الطبي غير موجود', 404);

  if (isDoctor && record.doctorId !== userId) {
    throw new AppError('غير مصرح لك بالوصول لهذا السجل', 403);
  } else if (!isDoctor && record.patientId !== userId) {
    throw new AppError('غير مصرح لك بالوصول لهذا السجل', 403);
  }

  return record;
};

export const updateRecord = async (doctorId, recordId, data) => {
  const record = await prisma.medicalRecord.findUnique({ where: { id: recordId } });
  
  if (!record) throw new AppError('السجل غير موجود', 404);
  if (record.doctorId !== doctorId) throw new AppError('غير مصرح، فقط الطبيب المُنشئ يمكنه تعديل السجل', 403);

  const updated = await prisma.medicalRecord.update({
    where: { id: recordId },
    data: {
      title: data.title || record.title,
      description: data.description || record.description,
    },
  });

  return updated;
};
