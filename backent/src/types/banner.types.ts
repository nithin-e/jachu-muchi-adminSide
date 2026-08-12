import { BannerStatus } from "../models/Banner";

export interface CreateBannerInput {
  heading: string;
  highlightedText: string;
  subtext: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  order: number;
  status: BannerStatus;
  image: string;
}

/** Omitted fields on update keep existing values. */
export interface UpdateBannerInput {
  heading?: string;
  highlightedText?: string;
  subtext?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  order?: number;
  status?: BannerStatus;
  image?: string;
}

export interface PublicBanner {
  id: string;
  heading: string;
  highlightedText: string;
  subtext: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  order: number;
  isActive: boolean;
  image: string;
  imageUrl: string;
  status: BannerStatus;
}
