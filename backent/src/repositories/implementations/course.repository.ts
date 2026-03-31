import { CourseModel, CourseStatus, ICourseDocument } from "../../models/Course";
import { CreateCourseInput, UpdateCourseInput } from "../../types/course.types";
import { ICourseRepository } from "../interfaces/ICourseRepository";

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

function scoreDocument(doc: ICourseDocument, normalizedSearch: string): number {
  const searchableValues = [
    doc.name,
    doc.type,
    doc.duration,
    doc.CourseOverview,
    doc.eligibility,
    doc.university,
    doc.college,
  ];
  let max = 0;
  for (const value of searchableValues) {
    const score = scoreValue(String(value ?? ""), normalizedSearch);
    if (score > max) max = score;
  }
  return max;
}

export class CourseRepository implements ICourseRepository {
  async create(payload: CreateCourseInput): Promise<ICourseDocument> {
    const doc = new CourseModel({
      name: payload.name,
      type: payload.type,
      duration: payload.duration,
      CourseOverview: payload.CourseOverview,
      eligibility: payload.eligibility,
      university: payload.university,
      college: payload.college,
      courseRoll: payload.courseRoll,
      ...(payload.syllabus ? { syllabus: payload.syllabus } : {}),
      ...(payload.courseHighlights ? { courseHighlights: payload.courseHighlights } : {}),
      ...(payload.careerOutcomes ? { careerOutcomes: payload.careerOutcomes } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
    });
    return doc.save();
  }

  async findById(id: string): Promise<ICourseDocument | null> {
    return CourseModel.findById(id);
  }

  async updateById(
    id: string,
    payload: UpdateCourseInput
  ): Promise<ICourseDocument | null> {
    const set: Record<string, unknown> = {
      name: payload.name,
      type: payload.type,
      duration: payload.duration,
      CourseOverview: payload.CourseOverview,
      eligibility: payload.eligibility,
      university: payload.university,
      college: payload.college,
      courseRoll: payload.courseRoll,
    };
    if (payload.syllabus !== undefined) {
      set.syllabus = payload.syllabus;
    }
    if (payload.courseHighlights !== undefined) {
      set.courseHighlights = payload.courseHighlights;
    }
    if (payload.careerOutcomes !== undefined) {
      set.careerOutcomes = payload.careerOutcomes;
    }
    if (payload.status !== undefined) {
      set.status = payload.status;
    }
    if (payload.imageUrl !== undefined) {
      set.imageUrl = payload.imageUrl;
    }
    return CourseModel.findByIdAndUpdate(id, { $set: set }, { new: true });
  }

  async deleteById(id: string): Promise<ICourseDocument | null> {
    return CourseModel.findByIdAndDelete(id);
  }

  async setCourseImageById(
    id: string,
    imageUrl: string | null
  ): Promise<ICourseDocument | null> {
    if (imageUrl === null || imageUrl === "") {
      return CourseModel.findByIdAndUpdate(
        id,
        { $unset: { imageUrl: "" } },
        { new: true }
      );
    }
    return CourseModel.findByIdAndUpdate(
      id,
      { $set: { imageUrl } },
      { new: true }
    );
  }

  async filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: CourseStatus;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: ICourseDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const { page, limit, search, status, type, sortBy, order = "desc" } =
      params;

    const skip = (page - 1) * limit;
    const mongoQuery: any = {};

    if (status) mongoQuery.status = status;
    if (type) mongoQuery.type = type;

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
      CourseModel.schema.path(mappedSortField) ||
      mappedSortField === "createdAt" ||
      mappedSortField === "updatedAt"
        ? mappedSortField
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    if (!applySearch) {
      const total = await CourseModel.countDocuments(mongoQuery);
      const pages = Math.ceil(total / limit);

      const data = await CourseModel.find(mongoQuery)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean();

      return { data, total, page, pages };
    }

    const candidates = await CourseModel.find(mongoQuery).lean();
    const ranked = candidates
      .map((doc) => ({
        doc,
        score: scoreDocument(doc as ICourseDocument, normalizedSearch),
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
      .map((item) => item.doc as ICourseDocument);

    return { data, total, page, pages };
  }
}
