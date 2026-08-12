import mongoose, { Document, Schema } from "mongoose";

export interface ISeoMetaDocument extends Document {
  pageUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  createdAt: Date;
  updatedAt: Date;
}

const seoMetaSchema = new Schema<ISeoMetaDocument>(
  {
    pageUrl: { type: String, required: true, unique: true, trim: true },
    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    metaKeywords: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const SeoMetaModel = mongoose.model<ISeoMetaDocument>(
  "seometas",
  seoMetaSchema
);
