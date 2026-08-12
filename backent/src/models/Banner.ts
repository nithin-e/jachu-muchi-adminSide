import mongoose, { Document, Schema } from "mongoose";

export const BANNER_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type BannerStatus = "Active" | "Inactive";

export const BANNER_STATUS_VALUES: BannerStatus[] = [
  BANNER_STATUS.ACTIVE,
  BANNER_STATUS.INACTIVE,
];

export const BANNER_PRIMARY_BUTTON_LINK = "/courses";

export interface IBannerDocument extends Document {
  heading: string;
  highlightedText: string;
  subtext: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  order: number;
  status: BannerStatus;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBannerDocument>(
  {
    heading: { type: String, default: "", trim: true },
    highlightedText: { type: String, default: "", trim: true },
    subtext: { type: String, default: "", trim: true },
    primaryButtonText: { type: String, default: "", trim: true },
    primaryButtonLink: {
      type: String,
      default: BANNER_PRIMARY_BUTTON_LINK,
      trim: true,
    },
    secondaryButtonText: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: BANNER_STATUS_VALUES,
      default: BANNER_STATUS.ACTIVE,
    },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const BannerModel = mongoose.model<IBannerDocument>(
  "banners",
  bannerSchema
);
