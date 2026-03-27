import fs from "fs";
import multer from "multer";
import path from "path";

const uploadRoot = path.join(process.cwd(), "uploads", "gallery");

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]/g, "_");
    const unique = `${Date.now()}-${safe}`;
    cb(null, unique);
  },
});

const allowedMime = new Set(["image/png", "image/jpeg", "image/jpg"]);

export const galleryImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedMime.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PNG and JPG images are allowed"));
  },
});

export const galleryUploadPublicPath = "/uploads/gallery";
