import {
  ITestimonialDocument,
  TestimonialModel,
} from "../../models/Testimonial";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../../types/testimonial.types";
import { ITestimonialRepository } from "../interfaces/ITestimonialRepository";

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

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      const or: any[] = [];
      if (TestimonialModel.schema.path("name")) or.push({ name: { $regex: regex } });
      if (TestimonialModel.schema.path("course"))
        or.push({ course: { $regex: regex } });
      if (TestimonialModel.schema.path("message"))
        or.push({ message: { $regex: regex } });
      if (or.length > 0) mongoQuery.$or = or;
    }

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      TestimonialModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt" ||
      sortFieldCandidate === "updatedAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const total = await TestimonialModel.countDocuments(mongoQuery);
    const pages = Math.ceil(total / limit);

    const data = await TestimonialModel.find(mongoQuery)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data, total, page, pages };
  }
}
