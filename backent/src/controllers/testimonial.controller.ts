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
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export class TestimonialController {
  constructor(private readonly testimonialService: ITestimonialService) {}

  list(req: Request, res: Response, next: NextFunction) {
    return this.listAll(req, res, next);
  }

  /**
   * Initial-load endpoint: returns all testimonials with details, no pagination.
   */
  private parseFilterQuery(query: Record<string, unknown>) {
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
      typeof searchRaw === "string" ? searchRaw : undefined;
    const status =
      typeof statusRaw === "string" && statusRaw.trim()
        ? statusRaw.trim()
        : undefined;
    const type =
      typeof typeRaw === "string" && typeRaw.trim() ? typeRaw.trim() : undefined;
    const sortBy =
      typeof sortByRaw === "string" && sortByRaw.trim()
        ? sortByRaw.trim()
        : "createdAt";
    const order =
      typeof orderRaw === "string" && orderRaw.trim()
        ? (orderRaw.trim() as "asc" | "desc")
        : undefined;

    return { page, limit, search, status, type, sortBy, order };
  }

  private mapListResponseData(input: any[]) {
    return input.map((doc) => {
      const { createdAt, updatedAt, __v, ...rest } = doc;
      return {
        ...rest,
        date: createdAt,
      };
    });
  }

  /**
   * Initial-load endpoint: return all testimonial details.
   * GET /api/testimonials
   */
  async listAll(req: Request, res: Response, next: NextFunction){
    try {
      const params = this.parseFilterQuery(req.query as Record<string, unknown>);
      const result = await this.testimonialService.filterTestimonials(params);

      return res.status(StatusCode.OK).json({
        success: true,
        total: result.total,
        page: result.page,
        limit: params.limit,
        data: this.mapListResponseData(result.data as any[]),
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Filtering endpoint: search + pagination + sorting + filtering.
   * GET /api/testimonials/filter
   */
  async filterTestimonials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const params = this.parseFilterQuery(req.query as Record<string, unknown>);
      const result = await this.testimonialService.filterTestimonials(params);

      return res.status(StatusCode.OK).json({
        success: true,
        total: result.total,
        page: result.page,
        limit: params.limit,
        data: this.mapListResponseData(result.data as any[]),
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
  }
  async create(req: Request, res: Response, next: NextFunction){
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
  }
  async update(req: Request, res: Response, next: NextFunction){
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
  }
  async delete(req: Request, res: Response, next: NextFunction){
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
  }
}
