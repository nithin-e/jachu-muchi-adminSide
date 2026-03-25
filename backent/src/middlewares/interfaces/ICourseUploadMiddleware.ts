import { NextFunction, Request, Response } from "express";

export interface ICourseUploadMiddleware {
  handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}
