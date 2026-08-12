import { BannerModel, IBannerDocument, BANNER_STATUS } from "../../models/Banner";
import { CreateBannerInput, UpdateBannerInput } from "../../types/banner.types";
import { IBannerRepository } from "../interfaces/IBannerRepository";

export class BannerRepository implements IBannerRepository {
  async create(payload: CreateBannerInput): Promise<IBannerDocument> {
    const doc = new BannerModel({
      heading: payload.heading,
      highlightedText: payload.highlightedText,
      subtext: payload.subtext,
      primaryButtonText: payload.primaryButtonText,
      primaryButtonLink: payload.primaryButtonLink,
      secondaryButtonText: payload.secondaryButtonText,
      order: payload.order,
      status: payload.status,
      image: payload.image,
    });
    return doc.save();
  }

  async findById(id: string): Promise<IBannerDocument | null> {
    return BannerModel.findById(id);
  }

  async findActive(): Promise<IBannerDocument[]> {
    return BannerModel.find({ status: BANNER_STATUS.ACTIVE }).sort({
      order: 1,
      createdAt: 1,
    });
  }

  async updateById(
    id: string,
    payload: UpdateBannerInput
  ): Promise<IBannerDocument | null> {
    const set: Record<string, unknown> = {};
    if (payload.heading !== undefined) set.heading = payload.heading;
    if (payload.highlightedText !== undefined) set.highlightedText = payload.highlightedText;
    if (payload.subtext !== undefined) set.subtext = payload.subtext;
    if (payload.primaryButtonText !== undefined) set.primaryButtonText = payload.primaryButtonText;
    if (payload.secondaryButtonText !== undefined) set.secondaryButtonText = payload.secondaryButtonText;
    if (payload.order !== undefined) set.order = payload.order;
    if (payload.status !== undefined) set.status = payload.status;
    if (payload.image !== undefined) set.image = payload.image;

    return BannerModel.findByIdAndUpdate(id, { $set: set }, { new: true });
  }

  async deleteById(id: string): Promise<IBannerDocument | null> {
    return BannerModel.findByIdAndDelete(id);
  }
}
