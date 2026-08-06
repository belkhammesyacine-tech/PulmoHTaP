// server/src/features/appointments/appointments.routes.js
import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import { validate } from '../../core/middleware/validate.js';
import * as schema from './appointments.schema.js';
import * as controller from './appointments.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(schema.createAppointmentSchema), controller.createAppointment);
router.get('/', controller.getAppointments);
router.get('/:id', controller.getAppointment);
router.put('/:id', validate(schema.updateAppointmentStatusSchema), controller.updateAppointment);

export default router;
