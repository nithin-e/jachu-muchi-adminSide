import { NextFunction, Request, Response } from "express";
import { articleImageUpload } from "../../config/multer.article";
import { HttpAppError } from "../../types/http-error.types";
import { ICourseUploadMiddleware } from "../interfaces/ICourseUploadMiddleware";

/** Same contract as course upload; uses `articleImage` field and articles storage. */
export class ArticleUploadMiddleware implements ICourseUploadMiddleware {
  private readonly fieldName = "articleImage";

  handle(req: Request, res: Response, next: NextFunction): void {
    articleImageUpload.single(this.fieldName)(req, res, (err: unknown) => {
      if (err) {
        const e = err as HttpAppError;
        e.status = 400;
        return next(e);
      }
      next();
    });
  }
}
