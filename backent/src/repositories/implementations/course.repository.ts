import { CourseModel, CourseStatus, ICourseDocument } from "../../models/Course";
import { CreateCourseInput, UpdateCourseInput } from "../../types/course.types";
import { ICourseRepository } from "../interfaces/ICourseRepository";

export class CourseRepository implements ICourseRepository {
  async create(payload: CreateCourseInput): Promise<ICourseDocument> {
    const doc = new CourseModel({
      name: payload.name,
      type: payload.type,
      duration: payload.duration,
      keyDetails: payload.keyDetails,
      eligibility: payload.eligibility,
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
      keyDetails: payload.keyDetails,
      eligibility: payload.eligibility,
    };
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

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      mongoQuery.$or = [
        { name: { $regex: regex } },
        { type: { $regex: regex } },
        { duration: { $regex: regex } },
        { keyDetails: { $regex: regex } },
        { eligibility: { $regex: regex } },
      ];
    }

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      CourseModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt" ||
      sortFieldCandidate === "updatedAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const total = await CourseModel.countDocuments(mongoQuery);
    const pages = Math.ceil(total / limit);

    const data = await CourseModel.find(mongoQuery)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data, total, page, pages };
  }
}
