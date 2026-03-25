import { IBannerDocument } from "../../models/Banner";
import { CreateBannerInput, UpdateBannerInput } from "../../types/banner.types";

export interface IBannerService {
  createBanner(input: CreateBannerInput): Promise<IBannerDocument>;
  updateBanner(
    bannerId: string,
    input: UpdateBannerInput
  ): Promise<IBannerDocument>;
  deleteBanner(bannerId: string): Promise<void>;
  getBannerById(bannerId: string): Promise<IBannerDocument>;
}
