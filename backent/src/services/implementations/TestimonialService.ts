import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { ITestimonialDocument } from "../../models/Testimonial";
import { ITestimonialRepository } from "../../repositories/interfaces/ITestimonialRepository";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../../types/testimonial.types";
import { throwBadRequest, throwNotFound } from "../../utils/httpErrors";
import { ITestimonialService } from "../interfaces/ITestimonialService";
import { MESSAGES } from "../../constants/messages";

function tryRemoveProfileImageFile(imageUrl?: string): void {
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
      payload.profileImageUrl !== undefined &&
      existing.profileImageUrl &&
      updated.profileImageUrl &&
      updated.profileImageUrl !== existing.profileImageUrl
    ) {
      tryRemoveProfileImageFile(existing.profileImageUrl);
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

    tryRemoveProfileImageFile(removed.profileImageUrl);
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
    const course = input.course?.trim() ?? "";
    const message = input.message?.trim() ?? "";

    if (!name) throwBadRequest(MESSAGES.TESTIMONIAL.NAME_REQUIRED);
    if (!course) throwBadRequest(MESSAGES.TESTIMONIAL.COURSE_REQUIRED);
    if (!message) throwBadRequest(MESSAGES.TESTIMONIAL.MESSAGE_REQUIRED);

    return {
      name,
      course,
      message,
      ...(input.profileImageUrl?.trim()
        ? { profileImageUrl: input.profileImageUrl.trim() }
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
