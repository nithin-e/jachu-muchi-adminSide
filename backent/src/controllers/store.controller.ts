import { NextFunction, Request, Response } from "express";
import path from "path";
import { storeUploadPublicPath } from "../config/multer.store";
import { StoreModel, IStoreDocument } from "../models/Store";
import { IStoreService } from "../services/interfaces/IStoreService";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export class StoreController {
  constructor(private readonly storeService: IStoreService) {}

  async listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await StoreModel.find().sort({ createdAt: -1 }).lean();
      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!id?.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.STORE.ID_REQUIRED,
        });
      }

      const data = await this.storeService.getStoreById(id);
      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const images: string[] = [];
      if (files && files.length > 0) {
        for (const file of files) {
          images.push(`${storeUploadPublicPath}/${path.basename(file.filename)}`);
        }
      } else if (req.body.images) {
        const bodyImages = req.body.images;
        if (Array.isArray(bodyImages)) {
          images.push(...bodyImages);
        } else if (typeof bodyImages === "string") {
          images.push(bodyImages);
        }
      }

      const name = typeof req.body.name === "string" ? req.body.name : "";
      const description = typeof req.body.description === "string" ? req.body.description : "";
      const status = typeof req.body.status === "string" ? req.body.status : undefined;
      const address = typeof req.body.address === "string" ? req.body.address : undefined;
      const phone = typeof req.body.phone === "string" ? req.body.phone : undefined;
      const email = typeof req.body.email === "string" ? req.body.email : undefined;

      const store = await this.storeService.createStore({
        name,
        description,
        images,
        status: status as any,
        address,
        phone,
        email,
      });

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.STORE.CREATED_SUCCESS,
        data: store,
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!id?.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.STORE.ID_REQUIRED,
        });
      }

      const files = req.files as Express.Multer.File[] | undefined;
      let images: string[] | undefined;
      if (files && files.length > 0) {
        images = [];
        for (const file of files) {
          images.push(`${storeUploadPublicPath}/${path.basename(file.filename)}`);
        }
      } else if (req.body.images !== undefined) {
        const bodyImages = req.body.images;
        if (Array.isArray(bodyImages)) {
          images = bodyImages;
        } else if (typeof bodyImages === "string") {
          images = [bodyImages];
        }
      }

      const payload: Record<string, unknown> = {};
      if (req.body.name !== undefined) payload.name = req.body.name;
      if (req.body.description !== undefined) payload.description = req.body.description;
      if (images !== undefined) payload.images = images;
      if (req.body.status !== undefined) payload.status = req.body.status;
      if (req.body.address !== undefined) payload.address = req.body.address;
      if (req.body.phone !== undefined) payload.phone = req.body.phone;
      if (req.body.email !== undefined) payload.email = req.body.email;

      const store = await this.storeService.updateStore(id, payload as any);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.STORE.UPDATED_SUCCESS,
        data: store,
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!id?.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.STORE.ID_REQUIRED,
        });
      }

      await this.storeService.deleteStore(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.STORE.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  }
}
