// server/src/features/appointments/appointments.controller.js
import * as appointmentsService from './appointments.service.js';

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.createAppointment(req.user.id, req.body);
    res.status(201).json({ message: 'تم إنشاء الموعد بنجاح', appointment });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentsService.getUserAppointments(req.user.id, req.user.accountType);
    res.json({ appointments });
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.getAppointmentById(req.user.id, req.params.id, req.user.accountType);
    res.json({ appointment });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.updateAppointmentStatus(req.user.id, req.params.id, req.body, req.user.accountType);
    res.json({ message: 'تم تحديث حالة الموعد', appointment });
  } catch (error) {
    next(error);
  }
};
