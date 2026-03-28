import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodes";

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    console.log('result is empty.............');
    return next();
  }
  console.log('result is not empty.............');
  
  return res.status(StatusCode.BAD_REQUEST).json({
    success: false,
    message: result.array()[0]?.msg || MESSAGES.COMMON.INVALID("request"),
    errors: result.array(),
  });
};
