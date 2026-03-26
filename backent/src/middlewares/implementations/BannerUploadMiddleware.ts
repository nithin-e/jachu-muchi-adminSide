import { NextFunction, Request, Response } from "express";
import { bannerImageUpload } from "../../config/multer.banner";
import { HttpAppError } from "../../types/http-error.types";
import { ICourseUploadMiddleware } from "../interfaces/ICourseUploadMiddleware";

export class BannerUploadMiddleware implements ICourseUploadMiddleware {
  private readonly fieldName = "bannerImage";

  handle(req: Request, res: Response, next: NextFunction): void {
    bannerImageUpload.single(this.fieldName)(req, res, (err: unknown) => {
      if (err) {
        const e = err as HttpAppError;
        e.status = 400;
        return next(e);
      }
      next();
    });
  }
}
