import { AdminUserStatus } from "../models/User";

export interface CreateAdminUserInput {
  name: string;
  email: string;
  role: string;
  status: AdminUserStatus;
  password: string;
}

export interface UpdateAdminUserInput {
  name: string;
  email: string;
  role: string;
  status: AdminUserStatus;
  /** Plain text; if omitted, password is unchanged. */
  password?: string;
}
