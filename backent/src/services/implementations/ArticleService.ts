import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import {
  ARTICLE_STATUS_VALUES,
  IArticleDocument,
  ArticleStatus,
} from "../../models/Article";
import { IArticleRepository } from "../../repositories/interfaces/IArticleRepository";
import {
  CreateArticleInput,
  UpdateArticleInput,
} from "../../types/article.types";
import { throwBadRequest, throwNotFound } from "../../utils/httpErrors";
import { IArticleService } from "../interfaces/IArticleService";
import { MESSAGES } from "../../constants/messages";

function tryRemoveArticleImageFile(imageUrl?: string): void {
  if (!imageUrl?.trim()) return;
  const base = "/uploads/articles/";
  if (!imageUrl.includes(base)) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename === "." || filename === "..") return;
  const absolute = path.join(process.cwd(), "uploads", "articles", filename);
  fs.unlink(absolute, () => {
    /* ignore missing file */
  });
}

export class ArticleService implements IArticleService {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async createArticle(input: CreateArticleInput): Promise<IArticleDocument> {
    const payload = this.normalizeAndValidate(input);
    return this.articleRepository.create(payload);
  }

  async updateArticle(
    articleId: string,
    input: UpdateArticleInput
  ): Promise<IArticleDocument> {
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      throwBadRequest(MESSAGES.ARTICLE.INVALID_ID);
    }

    const payload = this.normalizeAndValidate(input);

    const existing = await this.articleRepository.findById(articleId);
    if (!existing) {
      throwNotFound(MESSAGES.ARTICLE.NOT_FOUND);
    }

    const updated = await this.articleRepository.updateById(articleId, payload);
    if (!updated) {
      throwNotFound(MESSAGES.ARTICLE.NOT_FOUND);
    }

    if (
      payload.imageUrl !== undefined &&
      existing.imageUrl &&
      updated.imageUrl &&
      updated.imageUrl !== existing.imageUrl
    ) {
      tryRemoveArticleImageFile(existing.imageUrl);
    }

    return updated;
  }

  async deleteArticle(articleId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      throwBadRequest(MESSAGES.ARTICLE.INVALID_ID);
    }

    const removed = await this.articleRepository.deleteById(articleId);
    if (!removed) {
      throwNotFound(MESSAGES.ARTICLE.NOT_FOUND);
    }

    tryRemoveArticleImageFile(removed.imageUrl);
  }

  async getArticleById(articleId: string): Promise<IArticleDocument> {
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      throwBadRequest(MESSAGES.ARTICLE.INVALID_ID);
    }

    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throwNotFound(MESSAGES.ARTICLE.NOT_FOUND);
    }

    return article;
  }

  async getStats() {
    return this.articleRepository.getStats();
  }

  async filterArticles(params: {
    page: number;
    limit: number;
    search?: string;
    status?: ArticleStatus;
    type?: string;
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
      type,
      sortBy,
      order = "desc",
    } = params;

    if (!Number.isFinite(page) || page < 1) {
      throwBadRequest(MESSAGES.COMMON.PAGE_POSITIVE);
    }

    if (!Number.isFinite(limit) || limit < 1) {
      throwBadRequest(MESSAGES.COMMON.LIMIT_POSITIVE);
    }

    if (order !== "asc" && order !== "desc") {
      throwBadRequest(MESSAGES.COMMON.ORDER_ASC_DESC);
    }

    // `type` is accepted to match the template spec; for articles we map it to `status`.
    let normalizedStatus: ArticleStatus | undefined = status;
    if (type !== undefined) {
      if (typeof type !== "string" || !type.trim()) {
        throwBadRequest(MESSAGES.ARTICLE.TYPE_MUST_BE_PUBLISHED_OR_DRAFT);
      }
      const trimmed = type.trim() as ArticleStatus;
      if (!ARTICLE_STATUS_VALUES.includes(trimmed)) {
        throwBadRequest(MESSAGES.ARTICLE.TYPE_MUST_BE_PUBLISHED_OR_DRAFT);
      }
      normalizedStatus = trimmed;
    }

    if (normalizedStatus && !ARTICLE_STATUS_VALUES.includes(normalizedStatus)) {
      throwBadRequest(MESSAGES.ARTICLE.INVALID_STATUS_VALUE);
    }

    return this.articleRepository.filter({
      page,
      limit,
      search,
      status: normalizedStatus,
      sortBy,
      order,
    });
  }

  private normalizeAndValidate(
    input: CreateArticleInput | UpdateArticleInput
  ): CreateArticleInput {
    const title = input.title?.trim() ?? "";
    const description = input.description?.trim() ?? "";
    const articleDate = input.articleDate;
    const status = input.status;

    if (!title) throwBadRequest(MESSAGES.ARTICLE.TITLE_REQUIRED);
    if (!description) throwBadRequest(MESSAGES.ARTICLE.DESCRIPTION_REQUIRED);
    if (!articleDate || Number.isNaN(articleDate.getTime())) {
      throwBadRequest(MESSAGES.ARTICLE.VALID_DATE_REQUIRED);
    }
    if (!ARTICLE_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.ARTICLE.STATUS_MUST_BE_PUBLISHED_OR_DRAFT);
    }

    return {
      title,
      description,
      articleDate,
      status,
      ...(input.imageUrl?.trim()
        ? { imageUrl: input.imageUrl.trim() }
        : {}),
    };
  }
}
