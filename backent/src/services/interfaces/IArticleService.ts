import { IArticleDocument } from "../../models/Article";
import {
  ArticleStats,
  CreateArticleInput,
  UpdateArticleInput,
} from "../../types/article.types";
import { ArticleStatus } from "../../models/Article";

export interface IArticleService {
  createArticle(input: CreateArticleInput): Promise<IArticleDocument>;
  updateArticle(
    articleId: string,
    input: UpdateArticleInput
  ): Promise<IArticleDocument>;
  deleteArticle(articleId: string): Promise<void>;
  getArticleById(articleId: string): Promise<IArticleDocument>;
  getStats(): Promise<ArticleStats>;

  filterArticles(params: {
    page: number;
    limit: number;
    search?: string;
    status?: ArticleStatus;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IArticleDocument[];
    total: number;
    page: number;
    pages: number;
  }>;
}
