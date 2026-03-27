import { NextFunction, Request, Response } from "express";
import { CategoryModel, ICategoryDocument } from "../models/Category";
import { ICategoryService } from "../services/interfaces/ICategoryService";
import { getAllHandler } from "./getAllHandler";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export const getAllCategories = getAllHandler<ICategoryDocument>(
  CategoryModel,
  ["name"],
  ["nameKey"]
);

function mapBodyToName(body: Record<string, unknown>): string {
  return (
    (typeof body.name === "string" && body.name) ||
    (typeof body.categoryName === "string" && body.categoryName) ||
    ""
  );
}

export class CategoryController {
  constructor(private readonly categoryService: ICategoryService) {}

  list(req: Request, res: Response, next: NextFunction) {
    return getAllCategories(req, res, next);
  }

  /**
   * Initial-load endpoint: returns all categories with details, no pagination.
   */
  async listAll(_req: Request, res: Response, next: NextFunction){
    try {
      const data = await CategoryModel.find()
        .select("-nameKey")
        .sort({ createdAt: -1 });

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  /**
   * Filtering endpoint (search + pagination + sorting + filtering)
   * GET /api/categories/filter
   */
  async filterCategories(
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

      const result = await this.categoryService.filterCategories({
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
        total: result.total,
        page: result.page,
        limit,
        data: result.data.map((doc) => {
          const d = doc as any;
          const { createdAt, updatedAt, __v, ...rest } = d;
          return {
            ...rest,
            date: createdAt,
          };
        }),
      });
    } catch (error) {
      return next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction){
    try {
      const body = req.body as Record<string, unknown>;
      const name = mapBodyToName(body);
      const productCount = typeof body.productCount === "number" ? body.productCount : undefined;

      const category = await this.categoryService.createCategory({
        name,
        productCount,
      });

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.CATEGORY.CREATED_SUCCESS,
        data: category,
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
          message: MESSAGES.CATEGORY.ID_REQUIRED,
        });
      }

      const body = req.body as Record<string, unknown>;
      const name = mapBodyToName(body);
      const productCount = typeof body.productCount === "number" ? body.productCount : undefined;

      const category = await this.categoryService.updateCategory(id, {
        name,
        productCount,
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.CATEGORY.UPDATED_SUCCESS,
        data: category,
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
          message: MESSAGES.CATEGORY.ID_REQUIRED,
        });
      }

      await this.categoryService.deleteCategory(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.CATEGORY.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  }
}
