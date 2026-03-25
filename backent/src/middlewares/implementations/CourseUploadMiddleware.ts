import { NextFunction, Request, Response } from "express";
import { courseImageUpload } from "../../config/multer.course";
import { HttpAppError } from "../../utils/httpErrors";
import { ICourseUploadMiddleware } from "../interfaces/ICourseUploadMiddleware";

/**
 * Wraps multer single-file upload with consistent 400 error handling.
 */
export class CourseUploadMiddleware implements ICourseUploadMiddleware {
  private readonly fieldName = "courseImage";

  handle = (req: Request, res: Response, next: NextFunction): void => {
    courseImageUpload.single(this.fieldName)(req, res, (err: unknown) => {
      if (err) {
        const e = err as HttpAppError;
        e.status = 400;
        return next(e);
      }
      next();
    });
  };
}
