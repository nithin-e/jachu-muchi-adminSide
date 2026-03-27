import { CategoryModel, ICategoryDocument } from "../../models/Category";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../types/category.types";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";

function normalizeForSearch(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collapseRepeatedChars(input: string): string {
  return input.replace(/(.)\1+/g, "$1");
}

function scoreValue(value: string, normalizedSearch: string): number {
  const normalizedValue = normalizeForSearch(value);
  if (!normalizedValue) return 0;

  if (normalizedValue === normalizedSearch) return 300;
  if (normalizedValue.startsWith(normalizedSearch)) return 200;
  if (normalizedValue.includes(normalizedSearch)) return 100;

  const collapsedValue = collapseRepeatedChars(normalizedValue);
  const collapsedSearch = collapseRepeatedChars(normalizedSearch);

  if (collapsedValue === collapsedSearch) return 90;
  if (collapsedValue.startsWith(collapsedSearch)) return 80;
  if (collapsedValue.includes(collapsedSearch)) return 70;

  return 0;
}

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

    const rawSearch = search?.trim() ?? "";
    const specialChars = (rawSearch.match(/[^a-zA-Z0-9\s]/g) ?? []).length;
    const hasTooManySpecialChars =
      rawSearch.length > 0 && specialChars / rawSearch.length > 0.35;
    const normalizedSearch = normalizeForSearch(rawSearch);
    const applySearch =
      !hasTooManySpecialChars &&
      normalizedSearch.length >= 3 &&
      normalizedSearch.length > 0;

    const sortFieldCandidate = sortBy?.trim() || "date";
    const mappedSortField =
      sortFieldCandidate === "date" ? "createdAt" : sortFieldCandidate;
    const sortField =
      CategoryModel.schema.path(mappedSortField) ||
      mappedSortField === "createdAt" ||
      mappedSortField === "updatedAt"
        ? mappedSortField
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    if (!applySearch) {
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

    const candidates = await CategoryModel.find(mongoQuery)
      .select("-nameKey")
      .lean();

    const ranked = candidates
      .map((doc) => ({
        doc,
        score: scoreValue(String((doc as any).name ?? ""), normalizedSearch),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aValue = (a.doc as any)[sortField];
        const bValue = (b.doc as any)[sortField];
        if (aValue === bValue) return 0;
        if (sortDirection === 1) return aValue > bValue ? 1 : -1;
        return aValue > bValue ? -1 : 1;
      });

    const total = ranked.length;
    const pages = Math.ceil(total / limit);
    const data = ranked
      .slice(skip, skip + limit)
      .map((item) => item.doc as ICategoryDocument);

    return { data, total, page, pages };
  }
}
