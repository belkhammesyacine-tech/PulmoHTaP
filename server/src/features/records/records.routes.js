// server/src/features/records/records.routes.js
import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import { validate } from '../../core/middleware/validate.js';
import * as schema from './records.schema.js';
import * as controller from './records.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(schema.createRecordSchema), controller.createRecord);
router.get('/', controller.getRecords);
router.get('/:id', controller.getRecord);
router.put('/:id', validate(schema.updateRecordSchema), controller.updateRecord);

export default router;
