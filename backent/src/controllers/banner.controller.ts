import { NextFunction, Request, Response } from "express";
import path from "path";
import { bannerUploadPublicPath } from "../config/multer.banner";
import {
  mapBodyToCreateBannerInput,
  mapBodyToUpdateBannerInput,
} from "../dto/banner.mapper";
import { BannerModel, IBannerDocument } from "../models/Banner";
import { IBannerService } from "../services/interfaces/IBannerService";
import { getAllHandler } from "./getAllHandler";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export const getAllBanners = getAllHandler<IBannerDocument>(BannerModel, [
  "title",
  "status",
]);

export class BannerController {
  constructor(private readonly bannerService: IBannerService) {}

  list(req: Request, res: Response, next: NextFunction) {
    return getAllBanners(req, res, next);
  }

  /**
   * Initial-load endpoint: returns all banners with details, no pagination.
   */
  async listAll(_req: Request, res: Response, next: NextFunction){
    try {
      const data = await BannerModel.find().sort({ createdAt: -1 });

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.BANNER.ID_REQUIRED,
        });
      }

      const data = await this.bannerService.getBannerById(id);

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction){
    try {
      const file = req.file;
      let imageUrl: string | undefined;

      if (file?.filename) {
        imageUrl = `${bannerUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToCreateBannerInput(
        req.body as Record<string, unknown>,
        imageUrl
      );

      const data = await this.bannerService.createBanner(payload);

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.BANNER.CREATED_SUCCESS,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.BANNER.ID_REQUIRED,
        });
      }

      const file = req.file;
      let imageUrl: string | undefined;

      if (file?.filename) {
        imageUrl = `${bannerUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToUpdateBannerInput(
        req.body as Record<string, unknown>,
        imageUrl
      );

      const data = await this.bannerService.updateBanner(id, payload);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.BANNER.UPDATED_SUCCESS,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.BANNER.ID_REQUIRED,
        });
      }

      await this.bannerService.deleteBanner(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.BANNER.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  }
}
