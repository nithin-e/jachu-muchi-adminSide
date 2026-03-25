import { IArticleDocument } from "../../models/Article";
import {
  ArticleStats,
  CreateArticleInput,
  UpdateArticleInput,
} from "../../types/article.types";
import { ArticleStatus } from "../../models/Article";

export interface IArticleRepository {
  create(payload: CreateArticleInput): Promise<IArticleDocument>;
  findById(id: string): Promise<IArticleDocument | null>;
  updateById(
    id: string,
    payload: UpdateArticleInput
  ): Promise<IArticleDocument | null>;
  deleteById(id: string): Promise<IArticleDocument | null>;
  getStats(): Promise<ArticleStats>;

  filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: ArticleStatus;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IArticleDocument[];
    total: number;
    page: number;
    pages: number;
  }>;
}
