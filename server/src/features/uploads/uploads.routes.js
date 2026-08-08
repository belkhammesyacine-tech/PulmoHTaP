// server/src/features/uploads/uploads.routes.js
import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../core/middleware/authenticate.js';
import * as ctrl from './uploads.controller.js';

const router = Router();

// Store file in memory to upload directly to Supabase
const storage = multer.memoryStorage();
// Accept images and pdfs up to 5MB
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('فقط الصور وملفات PDF مسموحة!'));
    }
  }
});

router.use(authenticate);

// "file" is the name of the field in FormData
router.post('/', upload.single('file'), ctrl.uploadFile);

export default router;
