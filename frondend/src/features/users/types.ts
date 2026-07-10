export type ManagedUserRole = "Admin" | "Sub Admin" | "Editor";
export type ManagedUserStatus = "Active" | "Inactive";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedUserRole;
  status: ManagedUserStatus;
}

export type User = ManagedUser;
