import { NextFunction, Request, Response } from "express";
import { HttpAppError } from "../types/http-error.types";
import { MESSAGES } from "../constants/messages";

export const errorMiddleware = (
  error: HttpAppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || MESSAGES.ERROR.INTERNAL_SERVER_ERROR;

  const response: {
    success: false;
    message: string;
    path: string;
    method: string;
    stack?: string;
  } = {
    success: false,
    message,
    path: req.originalUrl,
    method: req.method,
  };

  if (process.env.NODE_ENV !== "production" && error.stack) {
    response.stack = error.stack;
  }

  res.status(status).json(response);
};
