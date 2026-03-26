import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { buildQuery } from "../utils/build-query.helper";
import { StatusCode } from "../constants/statusCodes";

export const getAllHandler = <T>(
  model: Model<T>,
  searchFields: string[],
  omitFields?: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildQuery(
        model,
        req.query as Record<string, unknown>,
        searchFields,
        omitFields
      );

      return res.status(StatusCode.OK).json({
        success: true,
        data: result.data,
        total: result.total,
        page: result.page,
        pages: result.pages,
      });
    } catch (error) {
      return next(error);
    }
  };
};
