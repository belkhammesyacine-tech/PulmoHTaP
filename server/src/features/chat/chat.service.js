// features/chat/chat.service.js
import prisma from '../../core/lib/prisma.js';

/**
 * Get a list of contacts (doctors or patients) that the user has had
 * appointments with — these are the only people they can message.
 */
export async function getContacts(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountType: true },
  });

  const isDoctor = ['DOCTOR', 'SPECIALIST'].includes(user.accountType);

  const appointments = await prisma.appointment.findMany({
    where: isDoctor
      ? { doctorId: userId }
      : { patientId: userId },
    select: isDoctor
      ? { patient: { select: { id: true, fullName: true, accountType: true } } }
      : { doctor:  { select: { id: true, fullName: true, accountType: true, doctorVerification: { select: { specialty: true } } } } },
    distinct: isDoctor ? ['patientId'] : ['doctorId'],
  });

  const contacts = appointments.map(a => isDoctor ? a.patient : a.doctor);
  
  // De-duplicate by id
  const seen = new Set();
  return contacts.filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

/**
 * Get the conversation history between two users (last 50 messages).
 */
export async function getMessages(userId, otherUserId) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId,   receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: 'asc' },
    take: 50,
    include: {
      sender: { select: { id: true, fullName: true } },
    },
  });

  // Mark received messages as read
  await prisma.message.updateMany({
    where: { senderId: otherUserId, receiverId: userId, isRead: false },
    data: { isRead: true },
  });

  return messages;
}

/**
 * Persist a message and return it with sender info.
 */
export async function saveMessage(senderId, receiverId, content) {
  return prisma.message.create({
    data: { senderId, receiverId, content },
    include: {
      sender: { select: { id: true, fullName: true } },
    },
  });
}

/**
 * Count unread messages for a user.
 */
export async function getUnreadCount(userId) {
  return prisma.message.count({ where: { receiverId: userId, isRead: false } });
}
