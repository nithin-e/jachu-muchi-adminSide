export type BannerStatus = "Active" | "Inactive";

export interface BannerItem {
  id: string;
  heading: string;
  highlightedText: string;
  subtext: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  order: number;
  status: BannerStatus;
  image: string;
}

export type Banner = BannerItem;
