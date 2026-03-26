/**
 * Shared HTTP-oriented errors for services (Express error middleware reads `status`).
 */
import { HttpStatusCode } from "axios";
import { HttpAppError } from "../types/http-error.types";

export function throwHttpError(status: number, message: string): never {
  const error = new Error(message) as HttpAppError;
  error.status = status;
  throw error;
}

export function throwBadRequest(message: string): never {
  return throwHttpError(HttpStatusCode.BadRequest, message);
}

export function throwNotFound(message: string): never {
  return throwHttpError(HttpStatusCode.NotFound, message);
}

export function throwConflict(message: string): never {
  return throwHttpError(HttpStatusCode.Conflict, message);
}

export function throwUnauthorized(message: string): never {
  return throwHttpError(HttpStatusCode.Unauthorized, message);
}
