import { NextFunction, Request, Response } from "express";
import { HttpAppError } from "../utils/httpErrors";
import { MESSAGES } from "../constants/messages";

export const errorMiddleware = (
  error: HttpAppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || MESSAGES.ERROR.INTERNAL_SERVER_ERROR;

  res.status(status).json({ message });
};
