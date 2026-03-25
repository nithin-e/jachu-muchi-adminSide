import { BannerStatus } from "../models/Banner";

export interface CreateBannerInput {
  title: string;
  status: BannerStatus;
  imageUrl: string;
}

/** Omitted `imageUrl` on update keeps the existing image. */
export interface UpdateBannerInput {
  title: string;
  status: BannerStatus;
  imageUrl?: string;
}
