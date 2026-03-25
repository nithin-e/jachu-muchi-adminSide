import { ICategoryDocument } from "../../models/Category";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../types/category.types";

export interface ICategoryRepository {
  create(payload: CreateCategoryInput): Promise<ICategoryDocument>;
  findById(id: string): Promise<ICategoryDocument | null>;
  findByName(name: string): Promise<ICategoryDocument | null>;
  updateById(
    id: string,
    payload: UpdateCategoryInput
  ): Promise<ICategoryDocument | null>;
  deleteById(id: string): Promise<ICategoryDocument | null>;

  filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: ICategoryDocument[];
    total: number;
    page: number;
    pages: number;
  }>;
}
