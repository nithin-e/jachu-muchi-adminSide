import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { IAlumniDocument } from "../../models/Alumni";
import { IAlumniRepository } from "../../repositories/interfaces/IAlumniRepository";
import { CreateAlumniInput, UpdateAlumniInput } from "../../types/alumni.types";
import { throwBadRequest, throwNotFound } from "../../utils/httpErrors";
import { IAlumniService } from "../interfaces/IAlumniService";
import { MESSAGES } from "../../constants/messages";

function tryRemoveProfileImageFile(imageUrl?: string): void {
  if (!imageUrl?.trim()) return;
  const base = "/uploads/alumni/";
  if (!imageUrl.includes(base)) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename === "." || filename === "..") return;
  const absolute = path.join(process.cwd(), "uploads", "alumni", filename);
  fs.unlink(absolute, () => {
    /* ignore missing file */
  });
}

export class AlumniService implements IAlumniService {
  constructor(private readonly alumniRepository: IAlumniRepository) {}

  async createAlumni(input: CreateAlumniInput): Promise<IAlumniDocument> {
    const payload = this.normalizeAndValidate(input);
    return this.alumniRepository.create(payload);
  }

  async updateAlumni(
    alumniId: string,
    input: UpdateAlumniInput
  ): Promise<IAlumniDocument> {
    if (!mongoose.Types.ObjectId.isValid(alumniId)) {
      throwBadRequest(MESSAGES.ALUMNI.INVALID_ID);
    }

    const payload = this.normalizeAndValidate(input);

    const existing = await this.alumniRepository.findById(alumniId);
    if (!existing) {
      throwNotFound(MESSAGES.ALUMNI.NOT_FOUND);
    }

    const updated = await this.alumniRepository.updateById(alumniId, payload);
    if (!updated) {
      throwNotFound(MESSAGES.ALUMNI.NOT_FOUND);
    }

    if (
      payload.profileImageUrl !== undefined &&
      existing.profileImageUrl &&
      updated.profileImageUrl &&
      updated.profileImageUrl !== existing.profileImageUrl
    ) {
      tryRemoveProfileImageFile(existing.profileImageUrl);
    }

    return updated;
  }

  async deleteAlumni(alumniId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(alumniId)) {
      throwBadRequest(MESSAGES.ALUMNI.INVALID_ID);
    }

    const removed = await this.alumniRepository.deleteById(alumniId);
    if (!removed) {
      throwNotFound(MESSAGES.ALUMNI.NOT_FOUND);
    }

    tryRemoveProfileImageFile(removed.profileImageUrl);
  }

  async getAlumniById(alumniId: string): Promise<IAlumniDocument> {
    if (!mongoose.Types.ObjectId.isValid(alumniId)) {
      throwBadRequest(MESSAGES.ALUMNI.INVALID_ID);
    }

    const doc = await this.alumniRepository.findById(alumniId);
    if (!doc) {
      throwNotFound(MESSAGES.ALUMNI.NOT_FOUND);
    }

    return doc;
  }

  private normalizeAndValidate(
    input: CreateAlumniInput | UpdateAlumniInput
  ): CreateAlumniInput {
    const name = input.name?.trim() ?? "";
    const role = input.role?.trim() ?? "";
    const company = input.company?.trim() ?? "";

    if (!name) throwBadRequest(MESSAGES.ALUMNI.NAME_REQUIRED);
    if (!role) throwBadRequest(MESSAGES.ALUMNI.ROLE_REQUIRED);
    if (!company) throwBadRequest(MESSAGES.ALUMNI.COMPANY_REQUIRED);

    return {
      name,
      role,
      company,
      ...(input.profileImageUrl?.trim()
        ? { profileImageUrl: input.profileImageUrl.trim() }
        : {}),
    };
  }

  async filterAlumni(params: {
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
    const { page, limit, search, status, type, sortBy, order } = params;

    if (!Number.isFinite(page) || page < 1) {
      throwBadRequest(MESSAGES.COMMON.PAGE_POSITIVE);
    }
    if (!Number.isFinite(limit) || limit < 1) {
      throwBadRequest(MESSAGES.COMMON.LIMIT_POSITIVE);
    }

    const safeOrder = order === "asc" ? "asc" : "desc";

    return this.alumniRepository.filter({
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
