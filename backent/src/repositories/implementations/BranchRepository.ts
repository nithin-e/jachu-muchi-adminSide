import { BranchModel, IBranchDocument } from "../../models/Branch";
import {
  CreateBranchInput,
  UpdateBranchInput,
} from "../../types/branch.types";
import { IBranchRepository } from "../interfaces/IBranchRepository";

export class BranchRepository implements IBranchRepository {
  async create(payload: CreateBranchInput): Promise<IBranchDocument> {
    const doc = new BranchModel({
      name: payload.name,
      location: payload.location,
      phoneNumbers: payload.phoneNumbers,
      mapUrl: payload.mapUrl,
      email: payload.email,
      status: payload.status,
    });
    return doc.save();
  }

  async findById(id: string): Promise<IBranchDocument | null> {
    return BranchModel.findById(id);
  }

  async updateById(
    id: string,
    payload: UpdateBranchInput
  ): Promise<IBranchDocument | null> {
    return BranchModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: payload.name,
          location: payload.location,
          phoneNumbers: payload.phoneNumbers,
          mapUrl: payload.mapUrl,
          email: payload.email,
          status: payload.status,
        },
      },
      { new: true, runValidators: true }
    );
  }

  async deleteById(id: string): Promise<IBranchDocument | null> {
    return BranchModel.findByIdAndDelete(id);
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
    data: IBranchDocument[];
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

    if (status && BranchModel.schema.path("status")) {
      mongoQuery.status = status;
    }
    // Branch schema doesn't have a `type` field; ignore template param if any.
    if (type && BranchModel.schema.path("type")) {
      mongoQuery.type = type;
    }

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      mongoQuery.$or = [
        { name: { $regex: regex } },
        { location: { $regex: regex } },
        { email: { $regex: regex } },
        { mapUrl: { $regex: regex } },
        { phoneNumbers: { $regex: regex } },
      ];
    }

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      BranchModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt" ||
      sortFieldCandidate === "updatedAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const total = await BranchModel.countDocuments(mongoQuery);
    const pages = Math.ceil(total / limit);

    const data = await BranchModel.find(mongoQuery)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data, total, page, pages };
  }
}
