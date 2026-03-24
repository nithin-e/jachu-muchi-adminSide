import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";

  res.status(status).json({ message });
};
