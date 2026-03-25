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
import { throwBadRequest, throwConflict, throwNotFound } from "../../utils/httpErrors";
import { IUserManagementService } from "../interfaces/IUserManagementService";
import { MESSAGES } from "../../constants/messages";

const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserManagementService implements IUserManagementService {
  constructor(
    private readonly userManagementRepository: IUserManagementRepository
  ) {}

  async createUser(input: CreateAdminUserInput): Promise<IUserDocument> {
    const name = input.name?.trim() ?? "";
    const email = input.email?.trim().toLowerCase() ?? "";
    const password = input.password ?? "";
    const role = input.role?.trim() ?? "";
    const status = input.status;

    if (!name) throwBadRequest(MESSAGES.USER.NAME_REQUIRED);
    if (!email) throwBadRequest(MESSAGES.USER.EMAIL_REQUIRED);
    if (!simpleEmail.test(email)) throwBadRequest(MESSAGES.USER.VALID_EMAIL_REQUIRED);
    if (!password || password.length < 6) {
      throwBadRequest(MESSAGES.USER.PASSWORD_REQUIRED_MIN6);
    }
    if (!ADMIN_USER_ROLE_VALUES.includes(role as (typeof ADMIN_USER_ROLE_VALUES)[number])) {
      throwBadRequest(MESSAGES.USER.ROLE_REQUIRED);
    }
    if (!ADMIN_USER_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.USER.STATUS_REQUIRED);
    }

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

    const name = input.name?.trim() ?? "";
    const email = input.email?.trim().toLowerCase() ?? "";
    const role = input.role?.trim() ?? "";
    const status = input.status;

    if (!name) throwBadRequest(MESSAGES.USER.NAME_REQUIRED);
    if (!email) throwBadRequest(MESSAGES.USER.EMAIL_REQUIRED);
    if (!simpleEmail.test(email)) throwBadRequest(MESSAGES.USER.VALID_EMAIL_REQUIRED);
    if (!ADMIN_USER_ROLE_VALUES.includes(role as (typeof ADMIN_USER_ROLE_VALUES)[number])) {
      throwBadRequest(MESSAGES.USER.ROLE_REQUIRED);
    }
    if (!ADMIN_USER_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.USER.STATUS_REQUIRED);
    }

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
      if (input.password.length < 6) {
        throwBadRequest(MESSAGES.USER.PASSWORD_REQUIRED_MIN6_ALT);
      }
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
