import { NextFunction, Request, Response } from "express";
import {
  mapBodyToCreateBranchInput,
  mapBodyToUpdateBranchInput,
} from "../dto/branch.mapper";
import { BranchModel, IBranchDocument } from "../models/Branch";
import { IBranchService } from "../services/interfaces/IBranchService";
import { getAllHandler } from "./getAllHandler";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export const getAllBranches = getAllHandler<IBranchDocument>(BranchModel, [
  "name",
  "location",
  "email",
]);

export class BranchController {
  constructor(private readonly branchService: IBranchService) {}

  list(req: Request, res: Response, next: NextFunction) {
    return getAllBranches(req, res, next);
  }

  /**
   * Initial-load endpoint: returns all branches with details, no pagination.
   */
  async listAll(_req: Request, res: Response, next: NextFunction){
    try {
      const data = await BranchModel.find().sort({ createdAt: -1 });

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
   * GET /api/branches/filter
   */
  async filterBranches(
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

      const result = await this.branchService.filterBranches({
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
  async getById(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.BRANCH.ID_REQUIRED,
        });
      }

      const data = await this.branchService.getBranchById(id);

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
      const payload = mapBodyToCreateBranchInput(
        req.body as Record<string, unknown>
      );
      const data = await this.branchService.createBranch(payload);

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.BRANCH.CREATED_SUCCESS,
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
          message: MESSAGES.BRANCH.ID_REQUIRED,
        });
      }

      const payload = mapBodyToUpdateBranchInput(
        req.body as Record<string, unknown>
      );
      const data = await this.branchService.updateBranch(id, payload);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.BRANCH.UPDATED_SUCCESS,
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
          message: MESSAGES.BRANCH.ID_REQUIRED,
        });
      }

      await this.branchService.deleteBranch(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.BRANCH.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  }
}
