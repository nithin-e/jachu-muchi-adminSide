import { NextFunction, Request, Response } from "express";
import { testimonialProfileUpload } from "../../config/multer.testimonial";
import { HttpAppError } from "../../types/http-error.types";
import { ICourseUploadMiddleware } from "../interfaces/ICourseUploadMiddleware";

/** Optional profile image; field name `profileImage` (multipart). */
export class TestimonialUploadMiddleware implements ICourseUploadMiddleware {
  private readonly fieldName = "profileImage";

  handle(req: Request, res: Response, next: NextFunction): void {
    testimonialProfileUpload.single(this.fieldName)(req, res, (err: unknown) => {
      if (err) {
        const e = err as HttpAppError;
        e.status = 400;
        return next(e);
      }
      next();
    });
  }
}
