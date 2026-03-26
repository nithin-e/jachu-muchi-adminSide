import { NextFunction, Request, Response } from "express";
import { alumniProfileUpload } from "../../config/multer.alumni";
import { HttpAppError } from "../../types/http-error.types";
import { ICourseUploadMiddleware } from "../interfaces/ICourseUploadMiddleware";

/** Optional profile photo; multipart field `profileImage`. */
export class AlumniUploadMiddleware implements ICourseUploadMiddleware {
  private readonly fieldName = "profileImage";

  handle(req: Request, res: Response, next: NextFunction): void {
    alumniProfileUpload.single(this.fieldName)(req, res, (err: unknown) => {
      if (err) {
        const e = err as HttpAppError;
        e.status = 400;
        return next(e);
      }
      next();
    });
  }
}
