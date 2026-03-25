import mongoose, { Document, Schema } from "mongoose";

export type GalleryCategory = "Campus" | "Labs" | "Events";

export const GALLERY_CATEGORY_VALUES: GalleryCategory[] = [
  "Campus",
  "Labs",
  "Events",
];

export interface IGalleryDocument extends Document {
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGalleryDocument>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: GALLERY_CATEGORY_VALUES,
      default: "Campus",
    },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const GalleryModel = mongoose.model<IGalleryDocument>(
  "gallery",
  gallerySchema
);
