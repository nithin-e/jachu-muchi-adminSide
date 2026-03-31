import { AlumniModel, IAlumniDocument } from "../../models/Alumni";
import { CreateAlumniInput, UpdateAlumniInput } from "../../types/alumni.types";
import { IAlumniRepository } from "../interfaces/IAlumniRepository";

export class AlumniRepository implements IAlumniRepository {
  async create(payload: CreateAlumniInput): Promise<IAlumniDocument> {
    const doc = new AlumniModel({
      name: payload.name,
      role: payload.role,
      company: payload.company,
      place: payload.place,
      ...(payload.profileImageUrl
        ? { profileImageUrl: payload.profileImageUrl }
        : {}),
    });
    return doc.save();
  }

  async findById(id: string): Promise<IAlumniDocument | null> {
    return AlumniModel.findById(id);
  }

  async updateById(
    id: string,
    payload: UpdateAlumniInput
  ): Promise<IAlumniDocument | null> {
    const set: Record<string, unknown> = {
      name: payload.name,
      role: payload.role,
      company: payload.company,
      place: payload.place,
    };
    if (payload.profileImageUrl !== undefined) {
      set.profileImageUrl = payload.profileImageUrl;
    }
    return AlumniModel.findByIdAndUpdate(id, { $set: set }, { new: true });
  }

  async deleteById(id: string): Promise<IAlumniDocument | null> {
    return AlumniModel.findByIdAndDelete(id);
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
    data: IAlumniDocument[];
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

    // Alumni schema does not have `status` or `type` fields,
    // but we keep params for template compatibility (ignored if path doesn't exist).
    if (status && AlumniModel.schema.path("status")) {
      mongoQuery.status = status;
    }
    if (type && AlumniModel.schema.path("type")) {
      mongoQuery.type = type;
    }

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      mongoQuery.$or = [
        { name: { $regex: regex } },
        { role: { $regex: regex } },
        { company: { $regex: regex } },
        { place: { $regex: regex } },
      ];
    }

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      AlumniModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt" ||
      sortFieldCandidate === "updatedAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const total = await AlumniModel.countDocuments(mongoQuery);
    const pages = Math.ceil(total / limit);

    const data = await AlumniModel.find(mongoQuery)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data, total, page, pages };
  }
}
