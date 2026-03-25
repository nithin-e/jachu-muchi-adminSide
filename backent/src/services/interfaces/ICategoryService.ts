import { ICategoryDocument } from "../../models/Category";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../types/category.types";

export interface ICategoryService {
  createCategory(input: CreateCategoryInput): Promise<ICategoryDocument>;
  updateCategory(
    categoryId: string,
    input: UpdateCategoryInput
  ): Promise<ICategoryDocument>;
  deleteCategory(categoryId: string): Promise<void>;

  filterCategories(params: {
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
