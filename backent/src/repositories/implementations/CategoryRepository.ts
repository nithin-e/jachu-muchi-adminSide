import { CategoryModel, ICategoryDocument } from "../../models/Category";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../types/category.types";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
  async create(payload: CreateCategoryInput): Promise<ICategoryDocument> {
    const doc = new CategoryModel({
      name: payload.name,
    });
    return doc.save();
  }

  async findById(id: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findById(id);
  }

  async findByName(name: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findOne({
      nameKey: name.trim().toLowerCase(),
    });
  }

  async updateById(
    id: string,
    payload: UpdateCategoryInput
  ): Promise<ICategoryDocument | null> {
    const name = payload.name.trim();
    return CategoryModel.findByIdAndUpdate(
      id,
      { $set: { name, nameKey: name.toLowerCase() } },
      { new: true }
    );
  }

  async deleteById(id: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findByIdAndDelete(id);
  }

  async filter(params: {
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
    const {
      page,
      limit,
      search,
      status,
      type,
      sortBy,
      order = "desc",
    } = params;

    const skip = (page - 1) * limit;

    const mongoQuery: any = {};

    if (status && CategoryModel.schema.path("status")) {
      mongoQuery.status = status;
    }
    if (type && CategoryModel.schema.path("type")) {
      mongoQuery.type = type;
    }

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      const or: any[] = [];
      if (CategoryModel.schema.path("name")) {
        or.push({ name: { $regex: regex } });
      }
      if (or.length > 0) mongoQuery.$or = or;
    }

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      CategoryModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt" ||
      sortFieldCandidate === "updatedAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const total = await CategoryModel.countDocuments(mongoQuery);
    const pages = Math.ceil(total / limit);

    const data = await CategoryModel.find(mongoQuery)
      .select("-nameKey")
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data, total, page, pages };
  }
}
