import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { AppError } from './errorHandler.js';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const allowedExtensions = ['.pdf', '.docx', '.doc'];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new AppError(
        'Invalid file type. Only PDF and DOCX files are allowed for resume analysis.',
        400,
        'INVALID_FILE_TYPE'
      )
    );
  }

  cb(null, true);
};

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter,
});
