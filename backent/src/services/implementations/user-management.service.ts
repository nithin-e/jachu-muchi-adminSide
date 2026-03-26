import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  ADMIN_USER_ROLE_VALUES,
  ADMIN_USER_STATUS_VALUES,
  AdminUserStatus,
  IUserDocument,
} from "../../models/User";
import { IUserManagementRepository } from "../../repositories/interfaces/IUserManagementRepository";
import {
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "../../types/adminUser.types";
import {
  throwBadRequest,
  throwConflict,
  throwNotFound,
} from "../../utils/http-errors.helper";
import { IUserManagementService } from "../interfaces/IUserManagementService";
import { MESSAGES } from "../../constants/messages";

export class UserManagementService implements IUserManagementService {
  constructor(
    private readonly userManagementRepository: IUserManagementRepository
  ) {}

  async createUser(input: CreateAdminUserInput): Promise<IUserDocument> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;
    const role = input.role;
    const status = input.status;

    const existing = await this.userManagementRepository.findByEmail(email);
    if (existing) {
      throwConflict(MESSAGES.USER.DUPLICATE_EMAIL);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return this.userManagementRepository.create({
      name,
      email,
      password: passwordHash,
      role,
      status,
    });
  }

  async updateUser(
    userId: string,
    input: UpdateAdminUserInput
  ): Promise<IUserDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throwBadRequest(MESSAGES.USER.INVALID_ID);
    }

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const role = input.role;
    const status = input.status;

    const current = await this.userManagementRepository.findById(userId);
    if (!current) {
      throwNotFound(MESSAGES.USER.NOT_FOUND);
    }

    const emailOwner = await this.userManagementRepository.findByEmail(
      email,
      userId
    );
    if (emailOwner) {
      throwConflict(MESSAGES.USER.DUPLICATE_EMAIL);
    }

    let passwordHash: string | undefined;
    if (input.password !== undefined) {
      passwordHash = await bcrypt.hash(input.password, 10);
    }

    const updated = await this.userManagementRepository.updateById(userId, {
      name,
      email,
      role,
      status,
      ...(passwordHash !== undefined ? { password: passwordHash } : {}),
    });

    if (!updated) {
      throwNotFound(MESSAGES.USER.NOT_FOUND);
    }

    return updated;
  }

  async deleteUser(userId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throwBadRequest(MESSAGES.USER.INVALID_ID);
    }

    const removed = await this.userManagementRepository.deleteById(userId);
    if (!removed) {
      throwNotFound(MESSAGES.USER.NOT_FOUND);
    }
  }

  async getUserById(userId: string): Promise<IUserDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throwBadRequest(MESSAGES.USER.INVALID_ID);
    }

    const doc = await this.userManagementRepository.findById(userId);
    if (!doc) {
      throwNotFound(MESSAGES.USER.NOT_FOUND);
    }

    return doc;
  }

  async filterUsers(params: {
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
    const { page, limit, search, status, type, sortBy, order } = params;

    if (!Number.isFinite(page) || page < 1) {
      throwBadRequest(MESSAGES.COMMON.PAGE_POSITIVE);
    }
    if (!Number.isFinite(limit) || limit < 1) {
      throwBadRequest(MESSAGES.COMMON.LIMIT_POSITIVE);
    }

    const safeOrder = order === "asc" ? "asc" : "desc";

    const normalizeEnumValue = <T extends string>(
      values: readonly T[],
      raw?: string
    ): T | undefined => {
      if (!raw || typeof raw !== "string") return undefined;
      const trimmed = raw.trim();
      if (!trimmed) return undefined;
      const lower = trimmed.toLowerCase();
      return values.find((v) => v.toLowerCase() === lower);
    };

    const normalizedStatus = normalizeEnumValue(
      ADMIN_USER_STATUS_VALUES,
      status as unknown as string | undefined
    );

    const normalizedRole = normalizeEnumValue(
      ADMIN_USER_ROLE_VALUES,
      type
    );

    if (status !== undefined && !normalizedStatus) {
      throwBadRequest(MESSAGES.USER.INVALID_STATUS_VALUE);
    }
    if (type !== undefined && !normalizedRole) {
      throwBadRequest(MESSAGES.USER.INVALID_TYPE_VALUE);
    }

    return this.userManagementRepository.filter({
      page,
      limit,
      search,
      status: normalizedStatus,
      type: normalizedRole,
      sortBy,
      order: safeOrder,
    });
  }
}
