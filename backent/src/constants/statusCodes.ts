import { HttpStatusCode } from "axios";
import type { StatusCodeType } from "../types/status-code.types";

export const StatusCode = {
  OK: HttpStatusCode.Ok,
  CREATED: HttpStatusCode.Created,
  BAD_REQUEST: HttpStatusCode.BadRequest,
  UNAUTHORIZED: HttpStatusCode.Unauthorized,
  FORBIDDEN: HttpStatusCode.Forbidden,
  NOT_FOUND: HttpStatusCode.NotFound,
  TOO_MANY_REQUESTS: HttpStatusCode.TooManyRequests,
  INTERNAL_SERVER_ERROR: HttpStatusCode.InternalServerError,
} as const;

export type { StatusCodeType };

