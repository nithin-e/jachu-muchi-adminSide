import { AdminUserStatus, IUserDocument, UserModel } from "../../models/User";
import {
  CreateUserDbPayload,
  IUserManagementRepository,
  UpdateUserDbPayload,
} from "../interfaces/IUserManagementRepository";

export class UserManagementRepository implements IUserManagementRepository {
  async create(payload: CreateUserDbPayload): Promise<IUserDocument> {
    const doc = new UserModel({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: payload.password,
      role: payload.role,
      status: payload.status,
    });
    return doc.save();
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async findByEmail(
    email: string,
    excludeId?: string
  ): Promise<IUserDocument | null> {
    const normalized = email.trim().toLowerCase();
    const query: Record<string, unknown> = { email: normalized };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return UserModel.findOne(query);
  }

  async updateById(
    id: string,
    payload: UpdateUserDbPayload
  ): Promise<IUserDocument | null> {
    const set: Record<string, unknown> = {
      name: payload.name,
      email: payload.email.toLowerCase(),
      role: payload.role,
      status: payload.status,
    };
    if (payload.password !== undefined) {
      set.password = payload.password;
    }
    return UserModel.findByIdAndUpdate(id, { $set: set }, { new: true });
  }

  async updatePasswordHashById(
    id: string,
    passwordHash: string
  ): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: { password: passwordHash } },
      { new: true }
    );
  }

  async deleteById(id: string): Promise<IUserDocument | null> {
    return UserModel.findByIdAndDelete(id);
  }

  async filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: AdminUserStatus;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IUserDocument[];
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

    if (status) mongoQuery.status = status;
    if (type) mongoQuery.role = type;

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      mongoQuery.$or = [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        { role: { $regex: regex } },
      ];
    }

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      UserModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt" ||
      sortFieldCandidate === "updatedAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const [total, data] = await Promise.all([
      UserModel.countDocuments(mongoQuery),
      UserModel.find(mongoQuery)
        .select("-password")
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const pages = Math.ceil(total / limit);

    return { data, total, page, pages };
  }
}
