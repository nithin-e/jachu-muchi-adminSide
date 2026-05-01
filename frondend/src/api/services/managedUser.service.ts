import { api } from "../client";

export type ManagedUserRole = "Admin" | "Sub Admin" | "Editor";
export type ManagedUserStatus = "Active" | "Inactive";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedUserRole;
  status: ManagedUserStatus;
}

const USERS_PATH = "/api/admin/users";
export const managedUserDetailPath = (id: string) => `/api/admin/users/${id}`;

type JsonPlaceholderUser = {
  id: number;
  name: string;
  email: string;
};

const isJpUser = (x: unknown): x is JsonPlaceholderUser =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as JsonPlaceholderUser).id === "number" &&
  typeof (x as JsonPlaceholderUser).name === "string";

const isManagedRow = (x: unknown): x is ManagedUser => {
  if (typeof x !== "object" || x === null) return false;
  const m = x as ManagedUser;
  return (
    typeof m.id === "string" &&
    (m.role === "Admin" || m.role === "Sub Admin" || m.role === "Editor")
  );
};

const roleFromIndex = (id: number): ManagedUserRole => {
  const r = id % 3;
  if (r === 0) return "Admin";
  if (r === 1) return "Sub Admin";
  return "Editor";
};

const statusFromIndex = (id: number): ManagedUserStatus => (id % 4 === 0 ? "Inactive" : "Active");

const mapJpToManaged = (u: JsonPlaceholderUser): ManagedUser => ({
  id: String(u.id),
  name: u.name,
  email: typeof u.email === "string" ? u.email : "",
  role: roleFromIndex(u.id),
  status: statusFromIndex(u.id),
});

const normalizeRole = (raw: unknown): ManagedUserRole => {
  if (typeof raw !== "string") return "Editor";
  const lower = raw.toLowerCase();
  if (lower === "admin") return "Admin";
  if (lower === "sub admin") return "Sub Admin";
  if (lower === "editor") return "Editor";
  return "Editor";
};

const rowToManaged = (raw: Record<string, unknown>): ManagedUser => ({
  id: String(raw._id ?? raw.id),
  name: String(raw.name ?? raw.fullName ?? ""),
  email: String(raw.email ?? ""),
  role: normalizeRole(raw.role),
  status: typeof raw.status === "string" && raw.status.toLowerCase() === "inactive" ? "Inactive" : "Active",
});

export const getManagedUsers = async (): Promise<ManagedUser[]> => {
  const res = await api.get<unknown>(USERS_PATH);
  const body = res.data as Record<string, unknown>;
  console.log("[getManagedUsers] API response:", body);

  // Backend returns { success: true, data: [...], total, page, pages }
  const rawArray = Array.isArray(body.data) ? body.data : [];
  console.log("[getManagedUsers] Extracted users array:", rawArray);

  if (rawArray.length === 0) return [];

  // Always normalize through rowToManaged to handle inconsistent backend data
  // (e.g. lowercase roles, missing name/status, _id vs id)
  return rawArray.map((item) => rowToManaged(item as Record<string, unknown>));
};

export const createManagedUser = async (
  payload: Omit<ManagedUser, "id">,
): Promise<ManagedUser> => {
  const res = await api.post<Record<string, unknown>>(USERS_PATH, {
    name: payload.name,
    email: payload.email,
    username: payload.role.replace(/\s+/g, "-").toLowerCase(),
    role: payload.role,
    status: payload.status,
  });
  const id = res.data.id != null ? String(res.data.id) : Date.now().toString();
  return { id, ...payload };
};

export const updateManagedUserApi = async (
  id: string,
  payload: Omit<ManagedUser, "id">,
): Promise<void> => {
  await api.put(managedUserDetailPath(id), {
    id: Number(id) || id,
    name: payload.name,
    email: payload.email,
    username: payload.role.replace(/\s+/g, "-").toLowerCase(),
    role: payload.role,
    status: payload.status,
  });
};

export const deleteManagedUserApi = async (id: string): Promise<void> => {
  await api.delete(managedUserDetailPath(id));
};
