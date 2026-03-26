import mongoose from "mongoose";
import { BRANCH_STATUS_VALUES, IBranchDocument } from "../../models/Branch";
import { IBranchRepository } from "../../repositories/interfaces/IBranchRepository";
import {
  CreateBranchInput,
  UpdateBranchInput,
} from "../../types/branch.types";
import { throwBadRequest, throwNotFound } from "../../utils/http-errors.helper";
import { IBranchService } from "../interfaces/IBranchService";
import { MESSAGES } from "../../constants/messages";

const simpleEmail =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class BranchService implements IBranchService {
  constructor(private readonly branchRepository: IBranchRepository) {}

  async createBranch(input: CreateBranchInput): Promise<IBranchDocument> {
    const payload = this.normalizeAndValidate(input);
    return this.branchRepository.create(payload);
  }

  async updateBranch(
    branchId: string,
    input: UpdateBranchInput
  ): Promise<IBranchDocument> {
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      throwBadRequest(MESSAGES.BRANCH.INVALID_ID);
    }

    const payload = this.normalizeAndValidate(input);

    const updated = await this.branchRepository.updateById(branchId, payload);
    if (!updated) {
      throwNotFound(MESSAGES.BRANCH.NOT_FOUND);
    }

    return updated;
  }

  async deleteBranch(branchId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      throwBadRequest(MESSAGES.BRANCH.INVALID_ID);
    }

    const removed = await this.branchRepository.deleteById(branchId);
    if (!removed) {
      throwNotFound(MESSAGES.BRANCH.NOT_FOUND);
    }
  }

  async getBranchById(branchId: string): Promise<IBranchDocument> {
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      throwBadRequest(MESSAGES.BRANCH.INVALID_ID);
    }

    const doc = await this.branchRepository.findById(branchId);
    if (!doc) {
      throwNotFound(MESSAGES.BRANCH.NOT_FOUND);
    }

    return doc;
  }

  private normalizeAndValidate(
    input: CreateBranchInput | UpdateBranchInput
  ): CreateBranchInput {
    const name = input.name?.trim() ?? "";
    const location = input.location?.trim() ?? "";
    const email = input.email?.trim() ?? "";
    const mapUrl = input.mapUrl?.trim() ?? "";
    const status = input.status;

    const phoneNumbers = (input.phoneNumbers ?? [])
      .map((p) => (typeof p === "string" ? p.trim() : ""))
      .filter(Boolean);

    if (!name) throwBadRequest(MESSAGES.BRANCH.NAME_REQUIRED);
    if (!location) throwBadRequest(MESSAGES.BRANCH.LOCATION_REQUIRED);
    if (!email) throwBadRequest(MESSAGES.BRANCH.EMAIL_REQUIRED);
    if (!simpleEmail.test(email)) {
      throwBadRequest(MESSAGES.BRANCH.VALID_EMAIL_REQUIRED);
    }
    if (phoneNumbers.length === 0) {
      throwBadRequest(MESSAGES.BRANCH.PHONE_REQUIRED);
    }
    if (!BRANCH_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.BRANCH.STATUS_MUST_BE_ACTIVE_OR_INACTIVE);
    }

    if (mapUrl && !/^https?:\/\//i.test(mapUrl)) {
      throwBadRequest(MESSAGES.BRANCH.MAP_URL_REQUIRED_HTTP);
    }

    return {
      name,
      location,
      phoneNumbers,
      mapUrl,
      email,
      status,
    };
  }

  async filterBranches(params: {
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
    const { page, limit, search, status, type, sortBy, order } = params;

    if (!Number.isFinite(page) || page < 1) {
      throwBadRequest(MESSAGES.COMMON.PAGE_POSITIVE);
    }
    if (!Number.isFinite(limit) || limit < 1) {
      throwBadRequest(MESSAGES.COMMON.LIMIT_POSITIVE);
    }
    const safeOrder = order === "asc" ? "asc" : "desc";

    if (status && !BRANCH_STATUS_VALUES.includes(status as any)) {
      // Only validate if status is provided, so existing clients won't break.
      throwBadRequest(
        MESSAGES.BRANCH.FILTER_STATUS_MUST_BE_ACTIVE_OR_INACTIVE
      );
    }

    return this.branchRepository.filter({
      page,
      limit,
      search,
      status,
      type,
      sortBy,
      order: safeOrder,
    });
  }
}
