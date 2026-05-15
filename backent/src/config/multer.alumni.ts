import fs from "fs";
import multer from "multer";
import path from "path";

const uploadRoot = path.join(process.cwd(), "uploads", "alumni");

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
const allowedExt = new Set([".png", ".jpg", ".jpeg"]);

export const alumniProfileUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMime.has(file.mimetype) || allowedExt.has(ext)) {
      cb(null, true);
      return;
    }
    cb(new Error("Please upload only PNG or JPG images. Selected file is not a valid image."));
  },
});

export const alumniUploadPublicPath = "/uploads/alumni";
