import { api } from "@lib/apiClient";
import type { Branch, BranchStatus } from "../types";

export const BRANCHES_LIST_PATH = "/api/admin/branches/all";
const BRANCHES_BASE_PATH = "/api/admin/branches";
export const branchDetailPath = (id: string) => `${BRANCHES_BASE_PATH}/${id}`;

type BranchApiRow = {
  _id: string;
  name: string;
  location?: string;
  phoneNumbers?: string[];
  mapUrl?: string;
  email?: string;
  status?: BranchStatus | string;
};

const isBranchRow = (x: unknown): x is Branch =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as Branch).id === "string" &&
  Array.isArray((x as Branch).phoneNumbers) &&
  typeof (x as Branch).name === "string";

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

const isBranchApiRow = (x: unknown): x is BranchApiRow =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as BranchApiRow)._id === "string" &&
  typeof (x as BranchApiRow).name === "string";

const normalizeStatus = (raw: unknown): BranchStatus =>
  raw === "Inactive" ? "Inactive" : "Active";

const mapApiRowToBranch = (row: BranchApiRow): Branch => ({
  id: row._id,
  name: row.name,
  location: typeof row.location === "string" ? row.location : "",
  phoneNumbers: Array.isArray(row.phoneNumbers)
    ? row.phoneNumbers.filter((p): p is string => typeof p === "string")
    : [],
  mapUrl: typeof row.mapUrl === "string" ? row.mapUrl : "",
  email: typeof row.email === "string" ? row.email : "",
  status: normalizeStatus(row.status),
});

const rowToBranch = (raw: Record<string, unknown>): Branch => {
  const phoneNumbers =
    Array.isArray(raw.phoneNumbers) &&
    raw.phoneNumbers.every((p) => typeof p === "string")
      ? (raw.phoneNumbers as string[])
      : Array.isArray(raw.phones) && raw.phones.every((p) => typeof p === "string")
        ? (raw.phones as string[])
        : typeof raw.phone === "string" && raw.phone.trim()
          ? raw.phone.split(/\s*,\s*|\s*;\s*/).filter(Boolean)
          : [];
  const status =
    raw.status === "Active" || raw.status === "Inactive" ? raw.status : "Active";
  return {
    id:
      raw.id != null
        ? String(raw.id)
        : raw._id != null
          ? String(raw._id)
          : "",
    name: String(raw.name ?? ""),
    location: String(raw.location ?? ""),
    phoneNumbers,
    mapUrl: String(raw.mapUrl ?? ""),
    email: String(raw.email ?? ""),
    status,
  };
};

export const getBranches = async (): Promise<Branch[]> => {
  const res = await api.get<unknown>(BRANCHES_LIST_PATH);
  const data = res.data;
  const list = isRecord(data) && Array.isArray(data.data) ? data.data : data;
  if (!Array.isArray(list) || list.length === 0) return [];
  if (isBranchRow(list[0])) return list as Branch[];
  if (isBranchApiRow(list[0])) {
    return (list as BranchApiRow[]).map(mapApiRowToBranch);
  }
  return list
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => rowToBranch(item));
};

export const getBranchById = async (id: string): Promise<Branch | null> => {
  try {
    const res = await api.get<unknown>(branchDetailPath(id));
    const row = isRecord(res.data) && isRecord(res.data.data) ? res.data.data : res.data;
    if (row && typeof row === "object") {
      if (isBranchRow(row)) return row;
      if (isBranchApiRow(row)) return mapApiRowToBranch(row);
      if (!Array.isArray(row)) return rowToBranch(row as Record<string, unknown>);
    }
    return null;
  } catch {
    return null;
  }
};

const branchToApiBody = (payload: Omit<Branch, "id">) => ({
  name: payload.name,
  location: payload.location,
  phoneNumbers: payload.phoneNumbers,
  mapUrl: payload.mapUrl,
  email: payload.email,
  status: payload.status,
});

export const createBranch = async (payload: Omit<Branch, "id">): Promise<Branch> => {
  const res = await api.post<Record<string, unknown>>(BRANCHES_BASE_PATH, branchToApiBody(payload));
  const row = isRecord(res.data) && isRecord(res.data.data) ? res.data.data : res.data;
  const id =
    isRecord(row) && row._id != null
      ? String(row._id)
      : isRecord(row) && row.id != null
        ? String(row.id)
        : Date.now().toString();
  return { id, ...payload };
};

export const updateBranchApi = async (id: string, payload: Omit<Branch, "id">): Promise<void> => {
  await api.put(branchDetailPath(id), branchToApiBody(payload));
};

export const deleteBranchApi = async (id: string): Promise<void> => {
  await api.delete(branchDetailPath(id));
};
