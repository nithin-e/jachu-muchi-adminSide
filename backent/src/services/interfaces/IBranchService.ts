import { IBranchDocument } from "../../models/Branch";
import {
  CreateBranchInput,
  UpdateBranchInput,
} from "../../types/branch.types";

export interface IBranchService {
  createBranch(input: CreateBranchInput): Promise<IBranchDocument>;
  updateBranch(
    branchId: string,
    input: UpdateBranchInput
  ): Promise<IBranchDocument>;
  deleteBranch(branchId: string): Promise<void>;
  getBranchById(branchId: string): Promise<IBranchDocument>;

  filterBranches(params: {
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
