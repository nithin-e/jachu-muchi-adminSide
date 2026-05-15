import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";
import { uploadPublicPath } from "../middlewares/upload.middleware";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.UPLOAD.NO_FILE,
      });
    }

    const filePath = `${uploadPublicPath}/${req.file.filename}`;

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: MESSAGES.UPLOAD.SUCCESS,
      data: {
        filename: req.file.filename,
        filePath,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    return next(error);
  }
};
