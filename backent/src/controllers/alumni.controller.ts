import { NextFunction, Request, Response } from "express";
import path from "path";
import { alumniUploadPublicPath } from "../config/multer.alumni";
import {
  mapBodyToCreateAlumniInput,
  mapBodyToUpdateAlumniInput,
} from "../dto/alumni.mapper";
import { AlumniModel, IAlumniDocument } from "../models/Alumni";
import { IAlumniService } from "../services/interfaces/IAlumniService";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export class AlumniController {
  constructor(private readonly alumniService: IAlumniService) {}

  /**
   * Initial-load endpoint: returns all alumni with details, no pagination.
   */
  async listAll(_req: Request, res: Response, next: NextFunction){
    try {
      const data = await AlumniModel.find().sort({ createdAt: -1 });

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  /**
   * Filtering endpoint: search + pagination + sorting + filtering.
   * GET /api/alumni/filter
   */
  async filterAlumni(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = req.query as Record<string, unknown>;

      const pageRaw = query.page;
      const limitRaw = query.limit;
      const searchRaw = query.search;
      const statusRaw = query.status;
      const typeRaw = query.type;
      const sortByRaw = query.sortBy;
      const orderRaw = query.order;

      const page =
        typeof pageRaw === "string" && pageRaw.trim()
          ? Number(pageRaw)
          : 1;
      const limit =
        typeof limitRaw === "string" && limitRaw.trim()
          ? Number(limitRaw)
          : 10;

      const search =
        typeof searchRaw === "string" && searchRaw.trim()
          ? searchRaw
          : undefined;

      const status =
        typeof statusRaw === "string" && statusRaw.trim()
          ? statusRaw
          : undefined;

      const type =
        typeof typeRaw === "string" && typeRaw.trim()
          ? typeRaw
          : undefined;

      const sortBy =
        typeof sortByRaw === "string" && sortByRaw.trim()
          ? sortByRaw
          : "createdAt";

      const order =
        typeof orderRaw === "string" && orderRaw.trim()
          ? orderRaw === "asc"
            ? "asc"
            : "desc"
          : "desc";

      const result = await this.alumniService.filterAlumni({
        page,
        limit,
        search,
        status,
        type,
        sortBy,
        order,
      });

      return res.status(StatusCode.OK).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction){
    try {
      const file = req.file;
      let profileImageUrl: string | undefined;

      if (file?.filename) {
        profileImageUrl = `${alumniUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToCreateAlumniInput(
        req.body as Record<string, unknown>,
        profileImageUrl
      );

      const data = await this.alumniService.createAlumni(payload);

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.ALUMNI.CREATED_SUCCESS,
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
          message: MESSAGES.ALUMNI.ID_REQUIRED,
        });
      }

      const file = req.file;
      let profileImageUrl: string | undefined;

      if (file?.filename) {
        profileImageUrl = `${alumniUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToUpdateAlumniInput(
        req.body as Record<string, unknown>,
        profileImageUrl
      );

      const data = await this.alumniService.updateAlumni(id, payload);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ALUMNI.UPDATED_SUCCESS,
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
          message: MESSAGES.ALUMNI.ID_REQUIRED,
        });
      }

      await this.alumniService.deleteAlumni(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ALUMNI.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  }
}
