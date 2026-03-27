import { NextFunction, Request, Response } from "express";
import path from "path";
import { articleUploadPublicPath } from "../config/multer.article";
import {
  mapBodyToCreateArticleInput,
  mapBodyToUpdateArticleInput,
} from "../dto/article.mapper";
import { ArticleModel, IArticleDocument } from "../models/Article";
import { IArticleService } from "../services/interfaces/IArticleService";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export class ArticleController {
  constructor(private readonly articleService: IArticleService) {}

  /**
   * Initial-load endpoint: returns all articles/news, no pagination.
   * GET /api/articles/all
   */
  async listAll(_req: Request, res: Response, next: NextFunction){
    try {
      const data = await ArticleModel.find().sort({ createdAt: -1 });

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  async stats(req: Request, res: Response, next: NextFunction){
    try {
      const data = await this.articleService.getStats();
      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
  /**
   * Filtering endpoint: search + pagination + sorting + status/type filtering.
   * GET /api/articles/filter
   */
  async filterArticles(
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
          ? (statusRaw as any)
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
          ? (orderRaw === "asc" ? "asc" : "desc")
          : "desc";

      const result = await this.articleService.filterArticles({
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
          message: MESSAGES.ARTICLE.ID_REQUIRED,
        });
      }

      const article = await this.articleService.getArticleById(id);

      return res.status(StatusCode.OK).json({
        success: true,
        data: article,
      });
    } catch (error) {
      return next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction){
    try {
      const file = req.file;
      let imageUrl: string | undefined;

      if (file?.filename) {
        imageUrl = `${articleUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToCreateArticleInput(
        req.body as Record<string, unknown>,
        imageUrl
      );

      const article = await this.articleService.createArticle(payload);

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.ARTICLE.CREATED_SUCCESS,
        data: article,
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
          message: MESSAGES.ARTICLE.ID_REQUIRED,
        });
      }

      const file = req.file;
      let imageUrl: string | undefined;

      if (file?.filename) {
        imageUrl = `${articleUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToUpdateArticleInput(
        req.body as Record<string, unknown>,
        imageUrl
      );

      const article = await this.articleService.updateArticle(id, payload);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ARTICLE.UPDATED_SUCCESS,
        data: article,
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
          message: MESSAGES.ARTICLE.ID_REQUIRED,
        });
      }

      await this.articleService.deleteArticle(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ARTICLE.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  }
}
