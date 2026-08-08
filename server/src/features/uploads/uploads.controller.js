// server/src/features/uploads/uploads.controller.js
import { supabase } from '../../core/lib/supabase.js';
import { AppError } from '../../core/errors/AppError.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError('لم يتم العثور على ملف للرفع', 400);
    }

    const file = req.file;
    // Generate a unique filename: folder + uuid + extension
    const ext = path.extname(file.originalname);
    const fileName = `${req.user.sub}/${uuidv4()}${ext}`;

    const { data, error } = await supabase.storage
      .from('pulmo-uploads')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new AppError(`خطأ في رفع الملف: ${error.message}`, 500);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('pulmo-uploads')
      .getPublicUrl(fileName);

    res.json({ 
      message: 'تم رفع الملف بنجاح', 
      url: publicUrlData.publicUrl 
    });
  } catch (err) {
    next(err);
  }
}
