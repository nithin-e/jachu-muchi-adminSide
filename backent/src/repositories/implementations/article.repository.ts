import {
  ARTICLE_STATUS,
  ArticleModel,
  IArticleDocument,
  ArticleStatus,
} from "../../models/Article";
import {
  ArticleStats,
  CreateArticleInput,
  UpdateArticleInput,
} from "../../types/article.types";
import { IArticleRepository } from "../interfaces/IArticleRepository";

export class ArticleRepository implements IArticleRepository {
  async create(payload: CreateArticleInput): Promise<IArticleDocument> {
    const doc = new ArticleModel({
      title: payload.title,
      description: payload.description,
      articleDate: payload.articleDate,
      status: payload.status,
      ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
    });
    return doc.save();
  }

  async findById(id: string): Promise<IArticleDocument | null> {
    return ArticleModel.findById(id);
  }

  async updateById(
    id: string,
    payload: UpdateArticleInput
  ): Promise<IArticleDocument | null> {
    const set: Record<string, unknown> = {
      title: payload.title,
      description: payload.description,
      articleDate: payload.articleDate,
      status: payload.status,
    };
    if (payload.imageUrl !== undefined) {
      set.imageUrl = payload.imageUrl;
    }
    return ArticleModel.findByIdAndUpdate(id, { $set: set }, { new: true });
  }

  async deleteById(id: string): Promise<IArticleDocument | null> {
    return ArticleModel.findByIdAndDelete(id);
  }

  async getStats(): Promise<ArticleStats> {
    const [total, published, draft] = await Promise.all([
      ArticleModel.countDocuments(),
      ArticleModel.countDocuments({ status: ARTICLE_STATUS.PUBLISHED }),
      ArticleModel.countDocuments({ status: ARTICLE_STATUS.DRAFT }),
    ]);
    return { total, published, draft };
  }

  async filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: ArticleStatus;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IArticleDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const {
      page,
      limit,
      search,
      status,
      sortBy,
      order = "desc",
    } = params;

    const skip = (page - 1) * limit;
    const mongoQuery: any = {};
    if (status) mongoQuery.status = status;

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      mongoQuery.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
      ];
    }

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      ArticleModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt" ||
      sortFieldCandidate === "updatedAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const total = await ArticleModel.countDocuments(mongoQuery);
    const pages = Math.ceil(total / limit);

    const data = await ArticleModel.find(mongoQuery)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data, total, page, pages };
  }
}
