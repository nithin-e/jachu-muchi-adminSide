import { IBranchDocument } from "../../models/Branch";
import {
  CreateBranchInput,
  UpdateBranchInput,
} from "../../types/branch.types";

export interface IBranchRepository {
  create(payload: CreateBranchInput): Promise<IBranchDocument>;
  findById(id: string): Promise<IBranchDocument | null>;
  updateById(
    id: string,
    payload: UpdateBranchInput
  ): Promise<IBranchDocument | null>;
  deleteById(id: string): Promise<IBranchDocument | null>;

  filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IBranchDocument[];
    total: number;
    page: number;
    pages: number;
  }>;
}
