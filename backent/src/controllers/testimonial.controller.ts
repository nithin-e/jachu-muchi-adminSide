import { NextFunction, Request, Response } from "express";
import path from "path";
import { testimonialUploadPublicPath } from "../config/multer.testimonial";
import {
  mapBodyToCreateTestimonialInput,
  mapBodyToUpdateTestimonialInput,
} from "../dto/testimonial.mapper";
import {
  ITestimonialDocument,
  TestimonialModel,
} from "../models/Testimonial";
import { ITestimonialService } from "../services/interfaces/ITestimonialService";
import { getAllHandler } from "./getAllHandler";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export const getAllTestimonials = getAllHandler<ITestimonialDocument>(
  TestimonialModel,
  ["name", "course", "message"]
);

export class TestimonialController {
  constructor(private readonly testimonialService: ITestimonialService) {}

  list = getAllTestimonials;

  /**
   * Initial-load endpoint: returns all testimonials with details, no pagination.
   */
  listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await TestimonialModel.find().sort({ createdAt: -1 });

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Filtering endpoint: search + pagination + sorting + filtering.
   * GET /api/testimonials/filter
   */
  filterTestimonials = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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

      const result = await this.testimonialService.filterTestimonials({
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
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.TESTIMONIAL.ID_REQUIRED,
        });
      }

      const data = await this.testimonialService.getTestimonialById(id);

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      let profileImageUrl: string | undefined;

      if (file?.filename) {
        profileImageUrl = `${testimonialUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToCreateTestimonialInput(
        req.body as Record<string, unknown>,
        profileImageUrl
      );

      const data = await this.testimonialService.createTestimonial(payload);

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.TESTIMONIAL.CREATED_SUCCESS,
        data,
      });
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.TESTIMONIAL.ID_REQUIRED,
        });
      }

      const file = req.file;
      let profileImageUrl: string | undefined;

      if (file?.filename) {
        profileImageUrl = `${testimonialUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToUpdateTestimonialInput(
        req.body as Record<string, unknown>,
        profileImageUrl
      );

      const data = await this.testimonialService.updateTestimonial(id, payload);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.TESTIMONIAL.UPDATED_SUCCESS,
        data,
      });
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.TESTIMONIAL.ID_REQUIRED,
        });
      }

      await this.testimonialService.deleteTestimonial(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.TESTIMONIAL.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  };
}
