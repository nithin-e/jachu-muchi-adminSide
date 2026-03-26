import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MESSAGES } from "../constants/messages";
import { throwUnauthorized } from "../utils/http-errors.helper";

type AuthTokenPayload = {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throwUnauthorized(MESSAGES.AUTHZ.INVALID_TOKEN);
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throwUnauthorized(MESSAGES.AUTHZ.INVALID_TOKEN);
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthTokenPayload;
    (req as Request & { user?: AuthTokenPayload }).user = decoded;
    return next();
  } catch (_error) {
    throwUnauthorized(MESSAGES.AUTHZ.INVALID_TOKEN);
  }
};
