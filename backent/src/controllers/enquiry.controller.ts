import { NextFunction, Request, Response } from "express";
import { EnquiryStatus } from "../models/Enquiry";
import { IEnquiryService } from "../services/interfaces/IEnquiryService";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export class EnquiryController {
  constructor(private readonly enquiryService: IEnquiryService) {}

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
        ? (statusRaw.trim() as EnquiryStatus)
        : undefined;
    const type =
      typeof typeRaw === "string" && typeRaw.trim() ? typeRaw.trim() : undefined;
    const sortBy =
      typeof sortByRaw === "string" && sortByRaw.trim()
        ? sortByRaw.trim()
        : "date";
    const order =
      typeof orderRaw === "string" && orderRaw.trim()
        ? (orderRaw.trim() as "asc" | "desc")
        : undefined;

    return { page, limit, search, status, type, sortBy, order };
  }

  private mapListResponseData(input: any[]) {
    return input.map((doc) => {
      const { createdAt, updatedAt, course, notes, __v, ...rest } = doc;
      return {
        ...rest,
        date: createdAt,
      };
    });
  }

  /**
   * Initial-load endpoint: return all enquiry details (no pagination).
   * GET /api/enquiries
   */
  async listAll(req: Request, res: Response, next: NextFunction){
    try {
      const params = this.parseFilterQuery(req.query as Record<string, unknown>);
      const result = await this.enquiryService.filterEnquiries(params);

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
  async updateStatus(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;
      const { status } = req.body as { status?: unknown };

      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ENQUIRY.ID_REQUIRED,
        });
      }

      if (typeof status !== "string" || !status.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ENQUIRY.STATUS_REQUIRED,
        });
      }

      const updatedEnquiry = await this.enquiryService.updateEnquiryStatus(
        id,
        status as EnquiryStatus
      );

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ENQUIRY.STATUS_UPDATED_SUCCESS,
        data: updatedEnquiry,
      });
    } catch (error) {
      return next(error);
    }
  }
  /**
   * Filtering endpoint (search + pagination + sorting + filtering)
   * GET /api/enquiries/filter
   */
  async filterEnquiries(req: Request, res: Response, next: NextFunction){
    try {
      const params = this.parseFilterQuery(req.query as Record<string, unknown>);
      const result = await this.enquiryService.filterEnquiries(params);

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
  async deleteEnquiry(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ENQUIRY.ID_REQUIRED,
        });
      }

      await this.enquiryService.deleteEnquiry(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ENQUIRY.DELETED_SUCCESS,
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
          message: MESSAGES.ENQUIRY.ID_REQUIRED,
        });
      }

      const data = await this.enquiryService.getEnquiryById(id);

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  async updateNotes(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ENQUIRY.ID_REQUIRED,
        });
      }

      const body = req.body as { notes?: unknown; note?: unknown };
      const notesRaw = body.notes ?? body.note;

      if (typeof notesRaw !== "string") {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ENQUIRY.NOTES_REQUIRED,
        });
      }

      const data = await this.enquiryService.updateEnquiryNotes(
        id,
        notesRaw
      );

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ENQUIRY.NOTES_UPDATED_SUCCESS,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
}
