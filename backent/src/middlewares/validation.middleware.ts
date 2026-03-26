import { NextFunction, Request, Response } from "express";
import { Schema, ValidationError } from "yup";
import { ValidationOptions } from "../types/validation.types";
import { throwBadRequest } from "../utils/http-errors.helper";

const validateWithSchema = async (schema: Schema, data: unknown) => {
  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

export const validateRequest = (schemas: ValidationOptions) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = (await validateWithSchema(
          schemas.body,
          req.body
        )) as Request["body"];
      }

      if (schemas.query) {
        req.query = (await validateWithSchema(
          schemas.query,
          req.query
        )) as Request["query"];
      }

      if (schemas.params) {
        req.params = (await validateWithSchema(
          schemas.params,
          req.params
        )) as Request["params"];
      }

      return next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return throwBadRequest(error.errors.join("; "));
      }
      return next(error);
    }
  };
};

export const validateBody = (schema: Schema) => validateRequest({ body: schema });
export const validateQuery = (schema: Schema) => validateRequest({ query: schema });
export const validateParams = (schema: Schema) => validateRequest({ params: schema });
