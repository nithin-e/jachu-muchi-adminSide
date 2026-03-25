import { IBannerDocument } from "../../models/Banner";
import { CreateBannerInput, UpdateBannerInput } from "../../types/banner.types";

export interface IBannerRepository {
  create(payload: CreateBannerInput): Promise<IBannerDocument>;
  findById(id: string): Promise<IBannerDocument | null>;
  updateById(
    id: string,
    payload: UpdateBannerInput
  ): Promise<IBannerDocument | null>;
  deleteById(id: string): Promise<IBannerDocument | null>;
}
