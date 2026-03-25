import { BannerModel, IBannerDocument } from "../../models/Banner";
import { CreateBannerInput, UpdateBannerInput } from "../../types/banner.types";
import { IBannerRepository } from "../interfaces/IBannerRepository";

export class BannerRepository implements IBannerRepository {
  async create(payload: CreateBannerInput): Promise<IBannerDocument> {
    const doc = new BannerModel({
      title: payload.title,
      status: payload.status,
      imageUrl: payload.imageUrl,
    });
    return doc.save();
  }

  async findById(id: string): Promise<IBannerDocument | null> {
    return BannerModel.findById(id);
  }

  async updateById(
    id: string,
    payload: UpdateBannerInput
  ): Promise<IBannerDocument | null> {
    const set: Record<string, unknown> = {
      title: payload.title,
      status: payload.status,
    };
    if (payload.imageUrl !== undefined) {
      set.imageUrl = payload.imageUrl;
    }
    return BannerModel.findByIdAndUpdate(id, { $set: set }, { new: true });
  }

  async deleteById(id: string): Promise<IBannerDocument | null> {
    return BannerModel.findByIdAndDelete(id);
  }
}
