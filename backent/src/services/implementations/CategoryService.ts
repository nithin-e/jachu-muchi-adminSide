import mongoose from "mongoose";
import { ICategoryDocument } from "../../models/Category";
import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../types/category.types";
import {
  throwBadRequest,
  throwConflict,
  throwNotFound,
} from "../../utils/httpErrors";
import { ICategoryService } from "../interfaces/ICategoryService";
import { MESSAGES } from "../../constants/messages";

export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async createCategory(input: CreateCategoryInput): Promise<ICategoryDocument> {
    const name = input.name?.trim();
    if (!name) {
      throwBadRequest(MESSAGES.CATEGORY.NAME_REQUIRED);
    }

    const duplicate = await this.categoryRepository.findByName(name);
    if (duplicate) {
      throwConflict(MESSAGES.CATEGORY.DUPLICATE_NAME);
    }

    return this.categoryRepository.create({ name });
  }

  async updateCategory(
    categoryId: string,
    input: UpdateCategoryInput
  ): Promise<ICategoryDocument> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throwBadRequest(MESSAGES.CATEGORY.INVALID_ID);
    }

    const name = input.name?.trim();
    if (!name) {
      throwBadRequest(MESSAGES.CATEGORY.NAME_REQUIRED);
    }

    const existing = await this.categoryRepository.findById(categoryId);
    if (!existing) {
      throwNotFound(MESSAGES.CATEGORY.NOT_FOUND);
    }

    const duplicate = await this.categoryRepository.findByName(name);
    if (
      duplicate &&
      String(duplicate._id) !== String(existing._id)
    ) {
      throwConflict(MESSAGES.CATEGORY.DUPLICATE_NAME);
    }

    const updated = await this.categoryRepository.updateById(categoryId, {
      name,
    });
    if (!updated) {
      throwNotFound(MESSAGES.CATEGORY.NOT_FOUND);
    }

    return updated;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throwBadRequest(MESSAGES.CATEGORY.INVALID_ID);
    }

    const removed = await this.categoryRepository.deleteById(categoryId);
    if (!removed) {
      throwNotFound(MESSAGES.CATEGORY.NOT_FOUND);
    }
  }

  async filterCategories(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: ICategoryDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const { page, limit, search, status, type, sortBy, order } = params;

    if (!Number.isFinite(page) || page < 1) {
      throwBadRequest(MESSAGES.COMMON.PAGE_POSITIVE);
    }

    if (!Number.isFinite(limit) || limit < 1) {
      throwBadRequest(MESSAGES.COMMON.LIMIT_POSITIVE);
    }

    if (order && order !== "asc" && order !== "desc") {
      throwBadRequest(MESSAGES.COMMON.ORDER_ASC_DESC);
    }

    return this.categoryRepository.filter({
      page,
      limit,
      search,
      status,
      type,
      sortBy,
      order,
    });
  }
}
