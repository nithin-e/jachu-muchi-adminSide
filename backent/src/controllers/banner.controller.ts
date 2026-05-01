import { NextFunction, Request, Response } from "express";
import fs from "fs";
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
      const imageInput: string = req.body.image;

      if (file?.filename) {
        imageUrl = `${bannerUploadPublicPath}/${path.basename(file.filename)}`;
      } else if (imageInput && imageInput.startsWith("data:image")) {
        const match = imageInput.match(/^data:image\/(\w+);base64,(.+)$/);
        if (match) {
          const ext = match[1];
          const base64Data = match[2];
          const filename = `banner-${Date.now()}.${ext}`;
          const uploadDir = path.join(process.cwd(), "uploads", "banners");
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          const filePath = path.join(uploadDir, filename);
          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
          imageUrl = `${bannerUploadPublicPath}/${filename}`;
        }
      } else if (imageInput) {
        imageUrl = imageInput;
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
      const imageInput: string = req.body.image;

      if (file?.filename) {
        imageUrl = `${bannerUploadPublicPath}/${path.basename(file.filename)}`;
      } else if (imageInput && imageInput.startsWith("data:image")) {
        const match = imageInput.match(/^data:image\/(\w+);base64,(.+)$/);
        if (match) {
          const ext = match[1];
          const base64Data = match[2];
          const filename = `banner-${Date.now()}.${ext}`;
          const uploadDir = path.join(process.cwd(), "uploads", "banners");
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          const filePath = path.join(uploadDir, filename);
          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
          imageUrl = `${bannerUploadPublicPath}/${filename}`;
        }
      } else if (imageInput) {
        imageUrl = imageInput;
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
  async toggleStatus(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.BANNER.ID_REQUIRED,
        });
      }

      const data = await this.bannerService.toggleStatus(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.BANNER.UPDATED_SUCCESS,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
}
