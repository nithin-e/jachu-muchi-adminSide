import {
  ITestimonialDocument,
  TestimonialModel,
} from "../../models/Testimonial";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../../types/testimonial.types";
import { ITestimonialRepository } from "../interfaces/ITestimonialRepository";

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

function scoreDocument(doc: ITestimonialDocument, normalizedSearch: string): number {
  const searchableValues = [doc.name, doc.course, doc.message];
  let max = 0;
  for (const value of searchableValues) {
    const score = scoreValue(String(value ?? ""), normalizedSearch);
    if (score > max) max = score;
  }
  return max;
}

export class TestimonialRepository implements ITestimonialRepository {
  async create(
    payload: CreateTestimonialInput
  ): Promise<ITestimonialDocument> {
    const doc = new TestimonialModel({
      name: payload.name,
      course: payload.course,
      message: payload.message,
      ...(payload.profileImageUrl
        ? { profileImageUrl: payload.profileImageUrl }
        : {}),
    });
    return doc.save();
  }

  async findById(id: string): Promise<ITestimonialDocument | null> {
    return TestimonialModel.findById(id);
  }

  async updateById(
    id: string,
    payload: UpdateTestimonialInput
  ): Promise<ITestimonialDocument | null> {
    const set: Record<string, unknown> = {
      name: payload.name,
      course: payload.course,
      message: payload.message,
    };
    if (payload.profileImageUrl !== undefined) {
      set.profileImageUrl = payload.profileImageUrl;
    }
    return TestimonialModel.findByIdAndUpdate(id, { $set: set }, { new: true });
  }

  async deleteById(id: string): Promise<ITestimonialDocument | null> {
    return TestimonialModel.findByIdAndDelete(id);
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
    data: ITestimonialDocument[];
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

    if (status && TestimonialModel.schema.path("status")) {
      mongoQuery.status = status;
    }

    if (type) {
      // For testimonials, the template `type` is treated as course filter.
      if (TestimonialModel.schema.path("type")) mongoQuery.type = type;
      else if (TestimonialModel.schema.path("course")) mongoQuery.course = type;
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

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      TestimonialModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt" ||
      sortFieldCandidate === "updatedAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    if (!applySearch) {
      const total = await TestimonialModel.countDocuments(mongoQuery);
      const pages = Math.ceil(total / limit);

      const data = await TestimonialModel.find(mongoQuery)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean();

      return { data, total, page, pages };
    }

    // Search ranking path:
    // exact > startsWith > contains, and tolerant repeated-char matching.
    const candidates = await TestimonialModel.find(mongoQuery).lean();
    const ranked = candidates
      .map((doc) => ({
        doc,
        score: scoreDocument(doc as ITestimonialDocument, normalizedSearch),
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
      .map((item) => item.doc as ITestimonialDocument);

    return { data, total, page, pages };
  }
}
