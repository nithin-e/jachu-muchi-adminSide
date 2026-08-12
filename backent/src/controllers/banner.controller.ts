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
  "heading",
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
  /**
   * Public endpoint: returns only active banners ordered by the order field.
   */
  async getPublicBanners(_req: Request, res: Response, next: NextFunction){
    try {
      const data = await this.bannerService.getActiveBanners();

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  /**
   * Standalone upload: stores the file under /uploads/banners and returns its public URL.
   */
  async uploadImage(req: Request, res: Response, next: NextFunction){
    try {
      if (!req.file) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.UPLOAD.NO_FILE,
        });
      }

      const filePath = `${bannerUploadPublicPath}/${path.basename(req.file.filename)}`;

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
  }

  /**
   * Persists a base64 data-URL image to /uploads/banners (async, non-blocking).
   * Returns the public URL, or undefined when the input is not a base64 image.
   */
  private async saveBase64Image(imageInput: string): Promise<string | undefined> {
    const match = imageInput.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) return undefined;

    const ext = match[1];
    const base64Data = match[2];
    const filename = `banner-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "uploads", "banners");
    const filePath = path.join(uploadDir, filename);

    await fs.promises.mkdir(uploadDir, { recursive: true });
    await fs.promises.writeFile(filePath, Buffer.from(base64Data, "base64"));

    return `${bannerUploadPublicPath}/${filename}`;
  }

  /**
   * Removes an uploaded file when a later step (e.g. DB write) fails,
   * so failed uploads do not leave orphaned files behind.
   */
  private async cleanupUploadedFile(publicPath: string): Promise<void> {
    try {
      const relative = publicPath.replace(bannerUploadPublicPath, "");
      const filePath = path.join(process.cwd(), "uploads", "banners", relative);
      await fs.promises.unlink(filePath);
    } catch {
      // File already gone or never created; nothing to clean up.
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
    let savedImage: string | undefined;
    try {
      const file = req.file;
      let image: string | undefined;
      const imageInput: string = req.body.image;

      if (file?.filename) {
        image = `${bannerUploadPublicPath}/${path.basename(file.filename)}`;
        savedImage = image;
      } else if (imageInput && imageInput.startsWith("data:image")) {
        image = await this.saveBase64Image(imageInput);
        savedImage = image;
      } else if (imageInput) {
        image = imageInput;
      }

      const payload = mapBodyToCreateBannerInput(
        req.body as Record<string, unknown>,
        image
      );

      const data = await this.bannerService.createBanner(payload);

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.BANNER.CREATED_SUCCESS,
        data,
      });
    } catch (error) {
      if (savedImage) {
        await this.cleanupUploadedFile(savedImage);
      }
      return next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction){
    let savedImage: string | undefined;
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.BANNER.ID_REQUIRED,
        });
      }

      const file = req.file;
      let image: string | undefined;
      const imageInput: string = req.body.image;

      if (file?.filename) {
        image = `${bannerUploadPublicPath}/${path.basename(file.filename)}`;
        savedImage = image;
      } else if (imageInput && imageInput.startsWith("data:image")) {
        image = await this.saveBase64Image(imageInput);
        savedImage = image;
      } else if (imageInput) {
        image = imageInput;
      }

      const payload = mapBodyToUpdateBannerInput(
        req.body as Record<string, unknown>,
        image
      );

      const data = await this.bannerService.updateBanner(id, payload);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.BANNER.UPDATED_SUCCESS,
        data,
      });
    } catch (error) {
      if (savedImage) {
        await this.cleanupUploadedFile(savedImage);
      }
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
