import { AdminUserStatus, IUserDocument } from "../../models/User";

export interface CreateUserDbPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  status: AdminUserStatus;
}

export interface UpdateUserDbPayload {
  name: string;
  email: string;
  role: string;
  status: AdminUserStatus;
  password?: string;
}

export interface IUserManagementRepository {
  create(payload: CreateUserDbPayload): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  findByEmail(
    email: string,
    excludeId?: string
  ): Promise<IUserDocument | null>;
  updateById(
    id: string,
    payload: UpdateUserDbPayload
  ): Promise<IUserDocument | null>;
  updatePasswordHashById(
    id: string,
    passwordHash: string
  ): Promise<IUserDocument | null>;
  deleteById(id: string): Promise<IUserDocument | null>;

  filter(params: {
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
