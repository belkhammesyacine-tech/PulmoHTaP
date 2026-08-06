// server/src/features/appointments/appointments.service.js
import prisma from '../../core/lib/prisma.js';
import { AppError } from '../../core/errors/AppError.js';
import { createNotification } from '../notifications/notifications.service.js';

export const createAppointment = async (patientId, data) => {
  const doctor = await prisma.user.findUnique({
    where: { id: data.doctorId },
  });

  if (!doctor || !['DOCTOR', 'SPECIALIST'].includes(doctor.accountType)) {
    throw new AppError('الطبيب غير موجود أو الحساب ليس لطبيب', 400);
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      doctorId: data.doctorId,
      date: new Date(data.date),
      reason: data.reason,
    },
  });

  return appointment;
};

export const getUserAppointments = async (userId, userType) => {
  const isDoctor = ['DOCTOR', 'SPECIALIST'].includes(userType);

  const appointments = await prisma.appointment.findMany({
    where: isDoctor ? { doctorId: userId } : { patientId: userId },
    include: {
      patient: { select: { id: true, fullName: true, email: true, phone: true } },
      doctor: { select: { id: true, fullName: true, accountType: true } },
    },
    orderBy: { date: 'asc' },
  });

  return appointments;
};

export const getAppointmentById = async (userId, appointmentId, userType) => {
  const isDoctor = ['DOCTOR', 'SPECIALIST'].includes(userType);

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: { select: { id: true, fullName: true, email: true, phone: true } },
      doctor: { select: { id: true, fullName: true, accountType: true } },
    },
  });

  if (!appointment) throw new AppError('الموعد غير موجود', 404);

  if (isDoctor && appointment.doctorId !== userId) {
    throw new AppError('غير مصرح لك بالوصول لهذا الموعد', 403);
  } else if (!isDoctor && appointment.patientId !== userId) {
    throw new AppError('غير مصرح لك بالوصول لهذا الموعد', 403);
  }

  return appointment;
};

export const updateAppointmentStatus = async (userId, appointmentId, data, userType) => {
  const isDoctor = ['DOCTOR', 'SPECIALIST'].includes(userType);
  const appointment = await getAppointmentById(userId, appointmentId, userType);

  // Patient can only cancel
  if (!isDoctor && data.status !== 'CANCELLED') {
    throw new AppError('لا تملك صلاحية تغيير حالة الموعد إلا لإلغائه', 403);
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: data.status,
      notes: data.notes || appointment.notes,
    },
  });

  // Send notification to the other party
  const statusLabels = { CONFIRMED: 'مؤكد ✅', CANCELLED: 'ملغى ❌', COMPLETED: 'مكتمل ✅' };
  const label = statusLabels[data.status];
  if (label) {
    const notifyUserId = isDoctor ? appointment.patientId : appointment.doctorId;
    await createNotification(notifyUserId, {
      title: `تحديث موعد — ${label}`,
      body: `تم تحديث حالة موعدك بتاريخ ${new Date(appointment.date).toLocaleDateString('ar-DZ')} إلى: ${label}`,
      type: data.status === 'CANCELLED' ? 'WARNING' : 'SUCCESS',
      link: '/appointments',
    });
  }

  return updated;
};
