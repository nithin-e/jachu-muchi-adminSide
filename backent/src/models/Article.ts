import mongoose, { Document, Schema } from "mongoose";

export const ARTICLE_STATUS = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
} as const;

export type ArticleStatus = "Published" | "Draft";

export const ARTICLE_STATUS_VALUES: ArticleStatus[] = [
  ARTICLE_STATUS.PUBLISHED,
  ARTICLE_STATUS.DRAFT,
];

export interface IArticleDocument extends Document {
  title: string;
  description: string;
  category: string;  // New field: Article category (e.g., "Campus", "Event", "News")
  details: string;   // New field: Detailed HTML content
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
    category: { type: String, required: true, trim: true },
    details: { type: String, required: true },
    articleDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ARTICLE_STATUS_VALUES,
      default: ARTICLE_STATUS.DRAFT,
    },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const ArticleModel = mongoose.model<IArticleDocument>(
  "articles",
  articleSchema
);
