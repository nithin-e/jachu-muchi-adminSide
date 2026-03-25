import { ArticleStatus } from "../models/Article";

export interface CreateArticleInput {
  title: string;
  description: string;
  articleDate: Date;
  status: ArticleStatus;
  imageUrl?: string;
}

/** Omitted `imageUrl` keeps existing image on update. */
export interface UpdateArticleInput {
  title: string;
  description: string;
  articleDate: Date;
  status: ArticleStatus;
  imageUrl?: string;
}

export interface ArticleStats {
  total: number;
  published: number;
  draft: number;
}
