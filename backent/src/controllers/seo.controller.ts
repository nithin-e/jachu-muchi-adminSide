import { NextFunction, Request, Response } from "express";
import { mapBodyToSaveSeoInput } from "../dto/seo.mapper";
import { ISeoService } from "../services/interfaces/ISeoService";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export class SeoController {
  constructor(private readonly seoService: ISeoService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const pageUrlParam = req.query.pageUrl;
      const pageUrl =
        typeof pageUrlParam === "string" ? pageUrlParam.trim() : "";

      if (pageUrl) {
        const data = await this.seoService.getByPageUrl(pageUrl);

        return res.status(StatusCode.OK).json({
          success: true,
          data,
        });
      }

      const data = await this.seoService.listAll();

      return res.status(StatusCode.OK).json({
        success: true,
        total: data.length,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }

  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown>;
      const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl.trim() : "";
      const input = mapBodyToSaveSeoInput(body);
      const data = await this.seoService.upsert(pageUrl, input);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.SEO.SAVED_SUCCESS,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
}
