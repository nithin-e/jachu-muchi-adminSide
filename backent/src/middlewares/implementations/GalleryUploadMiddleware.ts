import { NextFunction, Request, Response } from "express";
import { galleryImageUpload } from "../../config/multer.gallery";
import { HttpAppError } from "../../types/http-error.types";
import { ICourseUploadMiddleware } from "../interfaces/ICourseUploadMiddleware";

export class GalleryUploadMiddleware implements ICourseUploadMiddleware {
  private readonly fieldName = "galleryImage";

  handle(req: Request, res: Response, next: NextFunction): void {
    galleryImageUpload.single(this.fieldName)(req, res, (err: unknown) => {
      if (err) {
        const e = err as HttpAppError;
        e.status = 400;
        return next(e);
      }
      next();
    });
  }
}
