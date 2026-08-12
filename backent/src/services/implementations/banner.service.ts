import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { BANNER_PRIMARY_BUTTON_LINK, BANNER_STATUS_VALUES, BannerStatus, IBannerDocument } from "../../models/Banner";
import { IBannerRepository } from "../../repositories/interfaces/IBannerRepository";
import { CreateBannerInput, UpdateBannerInput, PublicBanner } from "../../types/banner.types";
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

    const payload = this.normalizeAndValidateUpdate(input, existing.image);

    const updated = await this.bannerRepository.updateById(bannerId, payload);
    if (!updated) {
      throwNotFound(MESSAGES.BANNER.NOT_FOUND);
    }

    if (
      payload.image !== undefined &&
      existing.image &&
      updated.image &&
      updated.image !== existing.image
    ) {
      tryRemoveBannerImageFile(existing.image);
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

    tryRemoveBannerImageFile(removed.image);
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

  async getActiveBanners(): Promise<PublicBanner[]> {
    const docs = await this.bannerRepository.findActive();

    return docs.map((doc) => {
      const raw = doc.toObject();
      const image = String(raw.image ?? "");
      return {
        id: String(raw._id),
        heading: String(raw.heading ?? ""),
        highlightedText: String(raw.highlightedText ?? ""),
        subtext: String(raw.subtext ?? ""),
        primaryButtonText: String(raw.primaryButtonText ?? ""),
        primaryButtonLink: String(raw.primaryButtonLink || BANNER_PRIMARY_BUTTON_LINK),
        secondaryButtonText: String(raw.secondaryButtonText ?? ""),
        order: Number(raw.order ?? 0),
        isActive: raw.status === "Active",
        image,
        imageUrl: image,
        status: raw.status === "Inactive" ? "Inactive" : "Active",
      };
    });
  }

  async toggleStatus(bannerId: string): Promise<IBannerDocument> {
    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      throwBadRequest(MESSAGES.BANNER.INVALID_ID);
    }

    const existing = await this.bannerRepository.findById(bannerId);
    if (!existing) {
      throwNotFound(MESSAGES.BANNER.NOT_FOUND);
    }

    const nextStatus: BannerStatus = existing.status === "Active" ? "Inactive" : "Active";
    const updated = await this.bannerRepository.updateById(bannerId, { status: nextStatus });
    if (!updated) {
      throwNotFound(MESSAGES.BANNER.NOT_FOUND);
    }

    return updated;
  }

  private normalizeAndValidateCreate(
    input: CreateBannerInput
  ): CreateBannerInput {
    const heading = input.heading?.trim() ?? "";
    const status = input.status;
    const image = input.image?.trim() ?? "";
    const order = this.normalizeOrder(input.order);

    if (!heading) throwBadRequest(MESSAGES.BANNER.HEADING_REQUIRED);
    if (!BANNER_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.BANNER.STATUS_MUST_BE_ACTIVE_OR_INACTIVE);
    }
    if (!image) {
      throwBadRequest(MESSAGES.BANNER.IMAGE_REQUIRED);
    }

    return {
      heading,
      highlightedText: input.highlightedText?.trim() ?? "",
      subtext: input.subtext?.trim() ?? "",
      primaryButtonText: input.primaryButtonText?.trim() ?? "",
      primaryButtonLink: BANNER_PRIMARY_BUTTON_LINK,
      secondaryButtonText: input.secondaryButtonText?.trim() ?? "",
      order,
      status,
      image,
    };
  }

  private normalizeAndValidateUpdate(
    input: UpdateBannerInput,
    existingImage: string
  ): UpdateBannerInput {
    const heading = input.heading?.trim();

    if (heading !== undefined && !heading) throwBadRequest(MESSAGES.BANNER.HEADING_REQUIRED);
    if (input.status !== undefined && !BANNER_STATUS_VALUES.includes(input.status)) {
      throwBadRequest(MESSAGES.BANNER.STATUS_MUST_BE_ACTIVE_OR_INACTIVE);
    }

    const out: UpdateBannerInput = {};

    if (heading !== undefined) out.heading = heading;
    if (input.highlightedText !== undefined) out.highlightedText = input.highlightedText.trim();
    if (input.subtext !== undefined) out.subtext = input.subtext.trim();
    if (input.primaryButtonText !== undefined) out.primaryButtonText = input.primaryButtonText.trim();
    if (input.secondaryButtonText !== undefined) out.secondaryButtonText = input.secondaryButtonText.trim();
    if (input.order !== undefined) out.order = this.normalizeOrder(input.order);
    if (input.status !== undefined) out.status = input.status;

    if (input.image !== undefined) {
      const next = input.image?.trim() || undefined;
      if (!next && !existingImage) {
        throwBadRequest(MESSAGES.BANNER.IMAGE_REQUIRED);
      }
      out.image = next ?? existingImage;
    }

    return out;
  }

  private normalizeOrder(value: number): number {
    if (!Number.isFinite(value) || value < 0) {
      throwBadRequest(MESSAGES.BANNER.INVALID_ORDER);
    }
    return Math.round(value);
  }
}
