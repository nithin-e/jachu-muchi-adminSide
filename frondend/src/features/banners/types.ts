export type BannerStatus = "Active" | "Inactive";

export interface BannerItem {
  id: string;
  title: string;
  image: string;
  status: BannerStatus;
  subtitle?: string;
  link?: string;
  active?: boolean;
}

export type Banner = BannerItem;
