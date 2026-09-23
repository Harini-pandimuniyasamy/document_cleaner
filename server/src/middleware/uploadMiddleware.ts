import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload folders exist
const originalDir = path.resolve(process.cwd(), 'server/uploads/original');
const cleanedDir = path.resolve(process.cwd(), 'server/uploads/cleaned');

if (!fs.existsSync(originalDir)) {
  fs.mkdirSync(originalDir, { recursive: true });
}
if (!fs.existsSync(cleanedDir)) {
  fs.mkdirSync(cleanedDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, originalDir);
  },
  filename: (_req, file, cb) => {
    // Generate safe unique filename
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported document format (${ext}). Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG`
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter,
});
