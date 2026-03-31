import { Request, Response, NextFunction } from "express";
import { throwUnauthorized } from "../utils/http-errors.helper";
import { MESSAGES } from "../constants/messages";

export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return throwUnauthorized(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (user.role !== requiredRole) {
      return throwUnauthorized(MESSAGES.AUTH.FORBIDDEN);
    }

    next();
  };
}
