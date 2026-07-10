import { NextFunction, Request, Response } from "express";
import { storeImageUpload } from "../../config/multer.store";
import { HttpAppError } from "../../types/http-error.types";

export class StoreUploadMiddleware {
  handle(req: Request, res: Response, next: NextFunction): void {
    storeImageUpload.array("images", 5)(req, res, (err: unknown) => {
      if (err) {
        const e = err as HttpAppError;
        e.status = 400;
        return next(e);
      }
      next();
    });
  }
}
