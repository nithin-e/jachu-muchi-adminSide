import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodes";
import { throwHttpError } from "../utils/http-errors.helper";

type RateLimiterOptions = {
  windowMs: number;
  max: number;
};

const store = new Map<string, { count: number; resetAt: number }>();

const createRateLimiter = (options: RateLimiterOptions) => {
  const windowMs = Math.max(1000, options.windowMs);
  const max = Math.max(1, options.max);

  return (req: Request, _res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    let entry = store.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > max) {
      throwHttpError(
        StatusCode.TOO_MANY_REQUESTS,
        "Too many requests, please try again later"
      );
    }

    return next();
  };
};

export const rateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
