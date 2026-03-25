import { NextFunction, Request, Response } from "express";
import {
  mapBodyToCreateAdminUser,
  mapBodyToUpdateAdminUser,
} from "../dto/adminUser.mapper";
import { IUserDocument, UserModel } from "../models/User";
import { IUserManagementService } from "../services/interfaces/IUserManagementService";
import { getAllHandler } from "./getAllHandler";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export const getAllUsers = getAllHandler<IUserDocument>(
  UserModel,
  ["name", "email", "role", "status"],
  ["password"]
);

export class UserManagementController {
  constructor(private readonly userManagementService: IUserManagementService) {}

  list = getAllUsers;

  /**
   * Initial-load endpoint: returns all users without pagination.
   */
  listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await UserModel.find()
        .select("-password")
        .sort({ createdAt: -1 });

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Filtering endpoint:
   * GET /api/users/filter
   *
   * Query params: page, limit, search, status, type, sortBy, order
   * Mapping: `type` => `role`
   */
  filterUsers = async (
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
          ? searchRaw.trim()
          : undefined;

      const status =
        typeof statusRaw === "string" && statusRaw.trim()
          ? statusRaw.trim()
          : undefined;

      const type =
        typeof typeRaw === "string" && typeRaw.trim()
          ? typeRaw.trim()
          : undefined;

      const sortBy =
        typeof sortByRaw === "string" && sortByRaw.trim()
          ? sortByRaw.trim()
          : "createdAt";

      const order =
        typeof orderRaw === "string" && orderRaw.trim()
          ? orderRaw === "asc"
            ? "asc"
            : "desc"
          : "desc";

      const result = await this.userManagementService.filterUsers({
        page,
        limit,
        search,
        status: status as any,
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
          message: MESSAGES.USER.ID_REQUIRED,
        });
      }

      const data = await this.userManagementService.getUserById(id);

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
      const payload = mapBodyToCreateAdminUser(
        req.body as Record<string, unknown>
      );
      const data = await this.userManagementService.createUser(payload);

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.USER.CREATED_SUCCESS,
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
          message: MESSAGES.USER.ID_REQUIRED,
        });
      }

      const payload = mapBodyToUpdateAdminUser(
        req.body as Record<string, unknown>
      );
      const data = await this.userManagementService.updateUser(id, payload);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.USER.UPDATED_SUCCESS,
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
          message: MESSAGES.USER.ID_REQUIRED,
        });
      }

      await this.userManagementService.deleteUser(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.USER.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  };
}
