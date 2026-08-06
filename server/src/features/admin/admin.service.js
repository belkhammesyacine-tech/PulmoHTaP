// features/admin/admin.service.js
import prisma from '../../core/lib/prisma.js';
import { logger } from '../../core/lib/logger.js';
import { Err } from '../../core/errors/AppError.js';

export async function getPendingVerifications() {
  return prisma.doctorVerification.findMany({
    where: { status: 'PENDING_REVIEW' },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          accountType: true,
          profile: {
            select: {
              wilaya: true
            }
          }
        }
      }
    },
    orderBy: { submittedAt: 'asc' }
  });
}

export async function reviewVerification(adminId, verificationId, { status, rejectionReason }) {
  if (status !== 'VERIFIED' && status !== 'REJECTED') {
    throw Err.badRequest('الحالة غير صالحة. يجب أن تكون VERIFIED أو REJECTED');
  }

  if (status === 'REJECTED' && !rejectionReason) {
    throw Err.badRequest('يجب تقديم سبب الرفض');
  }

  const verification = await prisma.doctorVerification.findUnique({
    where: { id: verificationId }
  });

  if (!verification) {
    throw Err.notFound('طلب التوثيق غير موجود');
  }

  if (verification.status !== 'PENDING_REVIEW') {
    throw Err.conflict('الطلب تمت مراجعته مسبقاً');
  }

  const updated = await prisma.doctorVerification.update({
    where: { id: verificationId },
    data: {
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      reviewedBy: adminId,
      reviewedAt: new Date()
    }
  });

  logger.info({ action: 'REVIEW_VERIFICATION', adminId, verificationId, status });
  return updated;
}

export async function getStats() {
  const [
    totalUsers,
    totalPatients,
    totalDoctors,
    totalAppointments,
    pendingAppointments,
    totalRecords,
    pendingVerifications,
  ] = await Promise.all([
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { accountType: 'PATIENT', status: 'ACTIVE' } }),
    prisma.user.count({ where: { accountType: { in: ['DOCTOR', 'SPECIALIST'] }, status: 'ACTIVE' } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'PENDING' } }),
    prisma.medicalRecord.count(),
    prisma.doctorVerification.count({ where: { status: 'PENDING_REVIEW' } }),
  ]);

  return {
    totalUsers,
    totalPatients,
    totalDoctors,
    totalAppointments,
    pendingAppointments,
    totalRecords,
    pendingVerifications,
  };
}

