// server/src/features/records/records.controller.js
import * as recordsService from './records.service.js';
import { AppError } from '../../core/errors/AppError.js';

export const createRecord = async (req, res, next) => {
  try {
    if (!['DOCTOR', 'SPECIALIST'].includes(req.user.accountType)) {
      throw new AppError('فقط الأطباء يمكنهم إضافة سجلات طبية', 403);
    }
    const record = await recordsService.createRecord(req.user.id, req.body);
    res.status(201).json({ message: 'تم إنشاء السجل بنجاح', record });
  } catch (error) {
    next(error);
  }
};

export const getRecords = async (req, res, next) => {
  try {
    const records = await recordsService.getUserRecords(req.user.id, req.user.accountType);
    res.json({ records });
  } catch (error) {
    next(error);
  }
};

export const getRecord = async (req, res, next) => {
  try {
    const record = await recordsService.getRecordById(req.user.id, req.params.id, req.user.accountType);
    res.json({ record });
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    if (!['DOCTOR', 'SPECIALIST'].includes(req.user.accountType)) {
      throw new AppError('فقط الأطباء يمكنهم تعديل السجلات الطبية', 403);
    }
    const record = await recordsService.updateRecord(req.user.id, req.params.id, req.body);
    res.json({ message: 'تم تحديث السجل بنجاح', record });
  } catch (error) {
    next(error);
  }
};
