import { BannerStatus } from "../models/Banner";

export interface CreateBannerInput {
  title: string;
  status: BannerStatus;
  imageUrl: string;
}

/** Omitted fields on update keep existing values. */
export interface UpdateBannerInput {
  title?: string;
  status?: BannerStatus;
  imageUrl?: string;
}
