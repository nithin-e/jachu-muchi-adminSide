import { NextFunction, Request, Response } from "express";
import multer from "multer";
import {
  bannerImageUpload,
  MAX_BANNER_IMAGE_SIZE_BYTES,
} from "../../config/multer.banner";
import { HttpAppError } from "../../types/http-error.types";
import { ICourseUploadMiddleware } from "../interfaces/ICourseUploadMiddleware";

const MAX_BANNER_IMAGE_SIZE_MB = Math.floor(
  MAX_BANNER_IMAGE_SIZE_BYTES / (1024 * 1024)
);

export class BannerUploadMiddleware implements ICourseUploadMiddleware {
  private readonly fieldName = "bannerImage";

  handle(req: Request, res: Response, next: NextFunction): void {
    bannerImageUpload.single(this.fieldName)(req, res, (err: unknown) => {
      if (err) {
        const e = err as HttpAppError;
        e.status = 400;
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
          e.message = `Image is too large. Maximum allowed size is ${MAX_BANNER_IMAGE_SIZE_MB}MB.`;
        }
        return next(e);
      }
      next();
    });
  }
}
