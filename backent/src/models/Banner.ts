import mongoose, { Document, Schema } from "mongoose";

export type BannerStatus = "Active" | "Inactive";

export const BANNER_STATUS_VALUES: BannerStatus[] = ["Active", "Inactive"];

export interface IBannerDocument extends Document {
  title: string;
  status: BannerStatus;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBannerDocument>(
  {
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: BANNER_STATUS_VALUES,
      default: "Active",
    },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const BannerModel = mongoose.model<IBannerDocument>(
  "banners",
  bannerSchema
);
