import { api } from "@lib/apiClient";
import type { Alumni } from "../types";

export const ALUMNI_LIST_PATH = "/api/admin/alumni/all";
const ALUMNI_BASE_PATH = "/api/admin/alumni";
export const alumniDetailPath = (id: string) => `${ALUMNI_BASE_PATH}/${id}`;

type AlumniApiRow = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  place?: string;
  profileImageUrl?: string;
  batch?: string;
  description?: string;
};

const isAlumniRow = (x: unknown): x is Alumni =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as Alumni).id === "string" &&
  "company" in x &&
  typeof (x as Alumni).company === "string" &&
  !("phones" in x);

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

const isApiAlumniRow = (x: unknown): x is AlumniApiRow =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as AlumniApiRow)._id === "string" &&
  typeof (x as AlumniApiRow).name === "string";

const mapApiRowToAlumni = (row: AlumniApiRow): Alumni => ({
  id: row._id,
  name: row.name,
  role: row.role ?? "",
  company: row.company ?? "",
  place: row.place ?? "",
  image: row.profileImageUrl ?? "",
  batch: row.batch ?? "",
  description: row.description ?? "",
});

const isDataUrl = (value: string): boolean => value.startsWith("data:");

const dataUrlToFile = (dataUrl: string): File | null => {
  const match = dataUrl.match(/^data:([^;,]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], `profile.${ext}`, { type: mime });
};

const buildAlumniFormData = (payload: Omit<Alumni, "id">): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("role", payload.role);
  formData.append("company", payload.company);
  formData.append("place", payload.place);
  formData.append("batch", payload.batch || "");
  formData.append("description", payload.description || "");
  const image = payload.image;
  if (isDataUrl(image)) {
    const file = dataUrlToFile(image);
    if (file) formData.append("profileImage", file);
  } else if (image.trim()) {
    formData.append("profileImageUrl", image);
  }
  return formData;
};

const rowToAlumni = (raw: Record<string, unknown>): Alumni => ({
  id: String(raw.id ?? raw._id ?? ""),
  name: String(raw.name ?? ""),
  role: String(raw.role ?? ""),
  company: String(raw.company ?? ""),
  place: String(raw.place ?? ""),
  image:
    typeof raw.image === "string"
      ? raw.image
      : typeof raw.profileImageUrl === "string"
        ? raw.profileImageUrl
        : "",
  batch: typeof raw.batch === "string" ? raw.batch : "",
  description: typeof raw.description === "string" ? raw.description : "",
});

export const getAlumniList = async (): Promise<Alumni[]> => {
  const res = await api.get<unknown>(ALUMNI_LIST_PATH);
  const data = res.data;
  const list = isRecord(data) && Array.isArray(data.data) ? data.data : data;
  if (!Array.isArray(list) || list.length === 0) return [];
  if (isAlumniRow(list[0])) return list as Alumni[];
  if (isApiAlumniRow(list[0])) {
    return (list as AlumniApiRow[]).map(mapApiRowToAlumni);
  }
  return list
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => rowToAlumni(item));
};

export const getAlumniById = async (id: string): Promise<Alumni | null> => {
  try {
    const res = await api.get<unknown>(alumniDetailPath(id));
    const row = isRecord(res.data) && isRecord(res.data.data) ? res.data.data : res.data;
    if (row && typeof row === "object") {
      if (isAlumniRow(row)) return row;
      if (isApiAlumniRow(row)) return mapApiRowToAlumni(row);
      return rowToAlumni(row as Record<string, unknown>);
    }
    return null;
  } catch {
    return null;
  }
};

export const createAlumni = async (payload: Omit<Alumni, "id">): Promise<Alumni> => {
  const res = await api.post<Record<string, unknown>>(ALUMNI_BASE_PATH, buildAlumniFormData(payload));
  const row = isRecord(res.data) && isRecord(res.data.data) ? res.data.data : res.data;
  const id =
    isRecord(row) && row._id != null
      ? String(row._id)
      : isRecord(row) && row.id != null
        ? String(row.id)
        : Date.now().toString();
  const createdImage =
    isRecord(row) && typeof row.profileImageUrl === "string"
      ? row.profileImageUrl
      : payload.image;
  return { ...payload, id, image: createdImage };
};

export const updateAlumniApi = async (id: string, payload: Omit<Alumni, "id">): Promise<void> => {
  await api.put(alumniDetailPath(id), buildAlumniFormData(payload));
};

export const deleteAlumniApi = async (id: string): Promise<void> => {
  await api.delete(alumniDetailPath(id));
};
