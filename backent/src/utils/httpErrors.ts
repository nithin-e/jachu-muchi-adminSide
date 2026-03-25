/**
 * Shared HTTP-oriented errors for services (Express error middleware reads `status`).
 */

export type HttpAppError = Error & { status?: number };

export function throwHttpError(status: number, message: string): never {
  const error = new Error(message) as HttpAppError;
  error.status = status;
  throw error;
}

export function throwBadRequest(message: string): never {
  return throwHttpError(400, message);
}

export function throwNotFound(message: string): never {
  return throwHttpError(404, message);
}

export function throwConflict(message: string): never {
  return throwHttpError(409, message);
}

export function throwUnauthorized(message: string): never {
  return throwHttpError(401, message);
}
