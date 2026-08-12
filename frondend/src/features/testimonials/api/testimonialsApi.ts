import { api, UPLOAD_TIMEOUT_MS } from "@lib/apiClient";
import type { Testimonial, TestimonialStatus } from "../types";

export const TESTIMONIALS_LIST_PATH = "/api/admin/testimonials/all";
const TESTIMONIALS_BASE_PATH = "/api/admin/testimonials";
export const testimonialDetailPath = (id: string) => `${TESTIMONIALS_BASE_PATH}/${id}`;

export const TESTIMONIAL_IMAGE_MAX_SIZE_BYTES = 2 * 1024 * 1024;

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

const unwrapResponseData = (response: unknown): unknown => {
  if (isRecord(response) && "data" in response) return response.data;
  return response;
};

const toStatus = (raw: unknown): TestimonialStatus =>
  raw === "Active" || raw === "Inactive" ? (raw as TestimonialStatus) : "Active";

const rowToTestimonial = (raw: Record<string, unknown>): Testimonial => ({
  id: String(raw.id ?? raw._id ?? ""),
  name: String(raw.name ?? ""),
  role: typeof raw.role === "string" ? raw.role : undefined,
  avatarUrl: String(raw.avatarUrl ?? raw.profileImageUrl ?? ""),
  content: String(raw.content ?? raw.message ?? ""),
  status: toStatus(raw.status),
});

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const res = await api.get<unknown>(TESTIMONIALS_LIST_PATH);
  const list = unwrapResponseData(res.data);
  if (!Array.isArray(list)) return [];
  return list.filter(isRecord).map(rowToTestimonial);
};

export const getTestimonialByIdApi = async (id: string): Promise<Testimonial | null> => {
  try {
    const res = await api.get<unknown>(`${TESTIMONIALS_BASE_PATH}/${id}`);
    const row = unwrapResponseData(res.data);
    if (!row || typeof row !== "object") return null;
    return rowToTestimonial(row as Record<string, unknown>);
  } catch {
    return null;
  }
};

const buildTestimonialPayload = (payload: Omit<Testimonial, "id">) => ({
  name: payload.name,
  content: payload.content,
  status: payload.status,
  ...(payload.role ? { role: payload.role } : {}),
  ...(payload.avatarUrl ? { avatarUrl: payload.avatarUrl } : {}),
});

export const createTestimonial = async (payload: Omit<Testimonial, "id">): Promise<Testimonial> => {
  const res = await api.post<Record<string, unknown>>(TESTIMONIALS_BASE_PATH, buildTestimonialPayload(payload));
  const response = res.data;
  const data = unwrapResponseData(response);
  const id =
    (isRecord(data) && data._id != null)
      ? String(data._id)
      : (isRecord(data) && data.id != null)
        ? String(data.id)
        : Date.now().toString();
  return { id, ...payload };
};

export const updateTestimonialApi = async (id: string, payload: Omit<Testimonial, "id">): Promise<void> => {
  await api.put(`${TESTIMONIALS_BASE_PATH}/${id}`, buildTestimonialPayload(payload));
};

type UploadResponse = {
  data?: {
    filePath?: string;
  };
};

export const uploadTestimonialImage = async (
  file: File,
  onProgress?: (percentLoaded: number) => void,
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.upload<UploadResponse>("/api/upload", formData, {
    timeoutMs: UPLOAD_TIMEOUT_MS,
    onUploadProgress: onProgress,
  });

  const filePath = res.data?.data?.filePath;
  if (!filePath) {
    throw new Error("Upload failed: no file URL returned by the server.");
  }
  return filePath;
};

export const deleteTestimonialApi = async (id: string): Promise<void> => {
  await api.delete(`${TESTIMONIALS_BASE_PATH}/${id}`);
};
