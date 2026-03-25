import mongoose, { Document, Schema } from "mongoose";

export type ArticleStatus = "Published" | "Draft";

export const ARTICLE_STATUS_VALUES: ArticleStatus[] = ["Published", "Draft"];

export interface IArticleDocument extends Document {
  title: string;
  description: string;
  articleDate: Date;
  status: ArticleStatus;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticleDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    articleDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ARTICLE_STATUS_VALUES,
      default: "Draft",
    },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const ArticleModel = mongoose.model<IArticleDocument>(
  "articles",
  articleSchema
);
