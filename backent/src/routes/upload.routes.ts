import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { upload } from "../middlewares/upload.middleware";
import { uploadImage } from "../controllers/upload.controller";
import { StatusCode } from "../constants/statusCodes";

const router = Router();

router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(StatusCode.BAD_REQUEST).json({
              success: false,
              message: "File too large. Maximum size allowed is 2MB",
            });
          }
          return res.status(StatusCode.BAD_REQUEST).json({
            success: false,
            message: err.message,
          });
        }
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  uploadImage
);

export default router;
