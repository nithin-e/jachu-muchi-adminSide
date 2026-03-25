import { AdminUserStatus, IUserDocument } from "../../models/User";
import {
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "../../types/adminUser.types";

export interface IUserManagementService {
  createUser(input: CreateAdminUserInput): Promise<IUserDocument>;
  updateUser(
    userId: string,
    input: UpdateAdminUserInput
  ): Promise<IUserDocument>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<IUserDocument>;

  filterUsers(params: {
    page: number;
    limit: number;
    search?: string;
    status?: AdminUserStatus;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IUserDocument[];
    total: number;
    page: number;
    pages: number;
  }>;
}
