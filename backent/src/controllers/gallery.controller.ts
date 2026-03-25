import { NextFunction, Request, Response } from "express";
import { GalleryModel, IGalleryDocument } from "../models/Gallery";
import { getAllHandler } from "./getAllHandler";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export const getAllGallery = getAllHandler<IGalleryDocument>(GalleryModel, [
  "title",
  "category",
]);

/**
 * Initial-load endpoint: returns all gallery items/details, no pagination.
 */
export const getAllGalleryInitial = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await GalleryModel.find().sort({ createdAt: -1 });
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
 * GET /api/gallery/filter
 * Supports: page, limit, search, status, type, sortBy, order
 *
 * Note: Gallery schema does not have `status/type`; we map:
 * - `status` (or `type` if `status` is absent) => `category`
 */
export const filterGallery = async (
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
        ? statusRaw.trim()
        : undefined;

    const type =
      typeof typeRaw === "string" && typeRaw.trim()
        ? typeRaw.trim()
        : undefined;

    const categoryFilter = status ?? type;

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

    if (!Number.isFinite(page) || page < 1) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.GALLERY.INVALID_PAGE,
      });
    }
    if (!Number.isFinite(limit) || limit < 1) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.GALLERY.INVALID_LIMIT,
      });
    }

    const mongoQuery: any = {};
    if (categoryFilter) mongoQuery.category = categoryFilter;

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      mongoQuery.$or = [
        { title: { $regex: regex } },
        { category: { $regex: regex } },
      ];
    }

    const sortDirection = order === "asc" ? 1 : -1;
    const sortField =
      GalleryModel.schema.path(sortBy) ||
      sortBy === "createdAt" ||
      sortBy === "updatedAt"
        ? sortBy
        : "createdAt";

    const skip = (page - 1) * limit;
    const total = await GalleryModel.countDocuments(mongoQuery);
    const pages = Math.ceil(total / limit);

    const data = await GalleryModel.find(mongoQuery)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(StatusCode.OK).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        pages,
      },
    });
  } catch (error) {
    return next(error);
  }
};
