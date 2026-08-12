import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import {
  ITestimonialDocument,
  TestimonialStatus,
  TESTIMONIAL_STATUS,
} from "../../models/Testimonial";
import { ITestimonialRepository } from "../../repositories/interfaces/ITestimonialRepository";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../../types/testimonial.types";
import { throwBadRequest, throwNotFound } from "../../utils/http-errors.helper";
import { ITestimonialService } from "../interfaces/ITestimonialService";
import { MESSAGES } from "../../constants/messages";

function tryRemoveAvatarFile(imageUrl?: string): void {
  if (!imageUrl?.trim()) return;
  const base = "/uploads/testimonials/";
  if (!imageUrl.includes(base)) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename === "." || filename === "..") return;
  const absolute = path.join(
    process.cwd(),
    "uploads",
    "testimonials",
    filename
  );
  fs.unlink(absolute, () => {
    /* ignore missing file */
  });
}

export class TestimonialService implements ITestimonialService {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository
  ) {}

  async createTestimonial(
    input: CreateTestimonialInput
  ): Promise<ITestimonialDocument> {
    const payload = this.normalizeAndValidate(input);
    return this.testimonialRepository.create(payload);
  }

  async updateTestimonial(
    testimonialId: string,
    input: UpdateTestimonialInput
  ): Promise<ITestimonialDocument> {
    if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
      throwBadRequest(MESSAGES.TESTIMONIAL.INVALID_ID);
    }

    const payload = this.normalizeAndValidate(input);

    const existing = await this.testimonialRepository.findById(testimonialId);
    if (!existing) {
      throwNotFound(MESSAGES.TESTIMONIAL.NOT_FOUND);
    }

    const updated = await this.testimonialRepository.updateById(
      testimonialId,
      payload
    );
    if (!updated) {
      throwNotFound(MESSAGES.TESTIMONIAL.NOT_FOUND);
    }

    if (
      payload.avatarUrl !== undefined &&
      existing.avatarUrl &&
      updated.avatarUrl &&
      updated.avatarUrl !== existing.avatarUrl
    ) {
      tryRemoveAvatarFile(existing.avatarUrl);
    }

    return updated;
  }

  async deleteTestimonial(testimonialId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
      throwBadRequest(MESSAGES.TESTIMONIAL.INVALID_ID);
    }

    const removed = await this.testimonialRepository.deleteById(testimonialId);
    if (!removed) {
      throwNotFound(MESSAGES.TESTIMONIAL.NOT_FOUND);
    }

    tryRemoveAvatarFile(removed.avatarUrl);
  }

  async getTestimonialById(
    testimonialId: string
  ): Promise<ITestimonialDocument> {
    if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
      throwBadRequest(MESSAGES.TESTIMONIAL.INVALID_ID);
    }

    const doc = await this.testimonialRepository.findById(testimonialId);
    if (!doc) {
      throwNotFound(MESSAGES.TESTIMONIAL.NOT_FOUND);
    }

    return doc;
  }

  private normalizeAndValidate(
    input: CreateTestimonialInput | UpdateTestimonialInput
  ): CreateTestimonialInput {
    const name = input.name?.trim() ?? "";
    const content = input.content?.trim() ?? "";

    if (!name) throwBadRequest(MESSAGES.TESTIMONIAL.NAME_REQUIRED);
    if (!content) throwBadRequest(MESSAGES.TESTIMONIAL.CONTENT_REQUIRED);

    let status: TestimonialStatus;
    if (
      input.status === TESTIMONIAL_STATUS.ACTIVE ||
      input.status === TESTIMONIAL_STATUS.INACTIVE
    ) {
      status = input.status;
    } else {
      throwBadRequest(MESSAGES.TESTIMONIAL.INVALID_STATUS);
    }

    const role = input.role?.trim() || undefined;

    return {
      name,
      content,
      status,
      ...(role ? { role } : {}),
      ...(input.avatarUrl?.trim()
        ? { avatarUrl: input.avatarUrl.trim() }
        : {}),
    };
  }

  async filterTestimonials(params: {
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
    const { page, limit, search, status, type, sortBy, order } = params;

    if (!Number.isFinite(page) || page < 1) {
      throwBadRequest(MESSAGES.COMMON.PAGE_POSITIVE);
    }

    if (!Number.isFinite(limit) || limit < 1) {
      throwBadRequest(MESSAGES.COMMON.LIMIT_POSITIVE);
    }

    if (order && order !== "asc" && order !== "desc") {
      throwBadRequest(MESSAGES.COMMON.ORDER_ASC_DESC);
    }

    return this.testimonialRepository.filter({
      page,
      limit,
      search,
      status,
      type,
      sortBy,
      order: order ?? "desc",
    });
  }
}
