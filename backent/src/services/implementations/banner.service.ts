import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { BANNER_STATUS_VALUES, IBannerDocument } from "../../models/Banner";
import { IBannerRepository } from "../../repositories/interfaces/IBannerRepository";
import { CreateBannerInput, UpdateBannerInput } from "../../types/banner.types";
import { throwBadRequest, throwNotFound } from "../../utils/http-errors.helper";
import { IBannerService } from "../interfaces/IBannerService";
import { MESSAGES } from "../../constants/messages";

function tryRemoveBannerImageFile(imageUrl?: string): void {
  if (!imageUrl?.trim()) return;
  const base = "/uploads/banners/";
  if (!imageUrl.includes(base)) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename === "." || filename === "..") return;
  const absolute = path.join(process.cwd(), "uploads", "banners", filename);
  fs.unlink(absolute, () => {
    /* ignore missing file */
  });
}

export class BannerService implements IBannerService {
  constructor(private readonly bannerRepository: IBannerRepository) {}

  async createBanner(input: CreateBannerInput): Promise<IBannerDocument> {
    const payload = this.normalizeAndValidateCreate(input);
    return this.bannerRepository.create(payload);
  }

  async updateBanner(
    bannerId: string,
    input: UpdateBannerInput
  ): Promise<IBannerDocument> {
    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      throwBadRequest(MESSAGES.BANNER.INVALID_ID);
    }

    const existing = await this.bannerRepository.findById(bannerId);
    if (!existing) {
      throwNotFound(MESSAGES.BANNER.NOT_FOUND);
    }

    const payload = this.normalizeAndValidateUpdate(input, existing.imageUrl);

    const updated = await this.bannerRepository.updateById(bannerId, payload);
    if (!updated) {
      throwNotFound(MESSAGES.BANNER.NOT_FOUND);
    }

    if (
      payload.imageUrl !== undefined &&
      existing.imageUrl &&
      updated.imageUrl &&
      updated.imageUrl !== existing.imageUrl
    ) {
      tryRemoveBannerImageFile(existing.imageUrl);
    }

    return updated;
  }

  async deleteBanner(bannerId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      throwBadRequest(MESSAGES.BANNER.INVALID_ID);
    }

    const removed = await this.bannerRepository.deleteById(bannerId);
    if (!removed) {
      throwNotFound(MESSAGES.BANNER.NOT_FOUND);
    }

    tryRemoveBannerImageFile(removed.imageUrl);
  }

  async getBannerById(bannerId: string): Promise<IBannerDocument> {
    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      throwBadRequest(MESSAGES.BANNER.INVALID_ID);
    }

    const doc = await this.bannerRepository.findById(bannerId);
    if (!doc) {
      throwNotFound(MESSAGES.BANNER.NOT_FOUND);
    }

    return doc;
  }

  private normalizeAndValidateCreate(
    input: CreateBannerInput
  ): CreateBannerInput {
    const title = input.title?.trim() ?? "";
    const status = input.status;
    const imageUrl = input.imageUrl?.trim() ?? "";

    if (!title) throwBadRequest(MESSAGES.BANNER.TITLE_REQUIRED);
    if (!BANNER_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.BANNER.STATUS_MUST_BE_ACTIVE_OR_INACTIVE);
    }
    if (!imageUrl) {
      throwBadRequest(MESSAGES.BANNER.IMAGE_REQUIRED);
    }

    return { title, status, imageUrl };
  }

  private normalizeAndValidateUpdate(
    input: UpdateBannerInput,
    existingImageUrl: string
  ): UpdateBannerInput {
    const title = input.title?.trim() ?? "";
    const status = input.status;

    if (!title) throwBadRequest(MESSAGES.BANNER.TITLE_REQUIRED);
    if (!BANNER_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.BANNER.STATUS_MUST_BE_ACTIVE_OR_INACTIVE);
    }

    const out: UpdateBannerInput = { title, status };

    if (input.imageUrl !== undefined) {
      const next = input.imageUrl?.trim() || undefined;
      if (!next && !existingImageUrl) {
        throwBadRequest(MESSAGES.BANNER.IMAGE_REQUIRED);
      }
      out.imageUrl = next ?? existingImageUrl;
    }

    return out;
  }
}
