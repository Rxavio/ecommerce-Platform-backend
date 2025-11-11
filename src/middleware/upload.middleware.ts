import multer from "multer";
import { Request } from "express";

const MAX_FILE_SIZE = Number(process.env.IMAGE_MAX_SIZE_MB) || 1 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (!ALLOWED.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Allowed: jpeg, png, webp"));
  }
  cb(null, true);
}

const uploader = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// Export helpers for route usage
export const productImageUpload = uploader.array("image", 5);
export default uploader;
