import { api } from "../client";
import type { BannerItem, BannerStatus } from "@/lib/banner-store";

export const BANNERS_LIST_PATH = "/api/admin/banners";
export const bannerDetailPath = (id: string) => `/api/admin/banners/${id}`;

const getApiBaseUrl = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return "";
};

const toAbsoluteImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (/^data:/.test(imageUrl)) return imageUrl;
  if (/^blob:/.test(imageUrl)) return imageUrl;

  const apiBase = getApiBaseUrl();

  return imageUrl.startsWith("/uploads")
    ? `${apiBase}${imageUrl}`
    : `${apiBase}/uploads/banners/${imageUrl}`;
};

type JsonPlaceholderPhoto = {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl?: string;
};

const isJpPhoto = (x: unknown): x is JsonPlaceholderPhoto =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as JsonPlaceholderPhoto).id === "number" &&
  typeof (x as JsonPlaceholderPhoto).url === "string" &&
  "title" in x;

const isBannerRow = (x: unknown): x is BannerItem =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as BannerItem).id === "string" &&
  typeof (x as BannerItem).image === "string";

const mapPhotoToBanner = (p: JsonPlaceholderPhoto): BannerItem => ({
  id: String(p.id),
  title: p.title || `Banner ${p.id}`,
  image: toAbsoluteImageUrl(p.url),
  status: p.id % 2 === 0 ? "Active" : "Inactive",
});

const rowToBanner = (raw: Record<string, unknown>): BannerItem => {
  const rawUrl = String(raw.imageUrl ?? raw.image ?? raw.url ?? "");
  return {
    id: String(raw._id ?? raw.id),
    title: String(raw.title ?? ""),
    image: toAbsoluteImageUrl(rawUrl),
    status: raw.status === "Active" || raw.status === "Inactive" ? (raw.status as "Active" | "Inactive") : "Active",
  };
};

const isBlobUrl = (value: string): boolean => value.startsWith("blob:");

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(blob);
  });

const imageToBase64 = async (image: string): Promise<string> => {
  if (!isBlobUrl(image)) return image;
  const res = await fetch(image);
  const blob = await res.blob();
  return blobToDataUrl(blob);
};

export const getBanners = async (): Promise<BannerItem[]> => {
  const res = await api.get<unknown>(`${BANNERS_LIST_PATH}/all?_limit=30`);

  const data = (res.data as any)?.data;

  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map((item: any) =>
    rowToBanner(item as Record<string, unknown>)
  );
};

export const getBannerById = async (id: string): Promise<BannerItem | null> => {
  try {
    const res = await api.get<unknown>(bannerDetailPath(id));
    const row = res.data;
    if (row && typeof row === "object") {
      if (isBannerRow(row)) return row;
      if (isJpPhoto(row)) return mapPhotoToBanner(row);
      return rowToBanner(row as Record<string, unknown>);
    }
    return null;
  } catch {
    return null;
  }
};

export const createBanner = async (payload: Omit<BannerItem, "id">): Promise<BannerItem> => {
  const base64Image = await imageToBase64(payload.image);
  const res = await api.post<Record<string, unknown>>(BANNERS_LIST_PATH, {
    title: payload.title,
    image: base64Image,
    status: payload.status,
  });
  const responseData = (res.data as any)?.data ?? res.data;
  const id = responseData._id != null ? String(responseData._id) : responseData.id != null ? String(responseData.id) : Date.now().toString();
  return {
    id,
    title: payload.title,
    image: typeof responseData.imageUrl === "string" ? toAbsoluteImageUrl(responseData.imageUrl) : payload.image,
    status: payload.status,
  };
};

export const updateBannerApi = async (id: string, payload: Omit<BannerItem, "id">): Promise<void> => {
  const base64Image = await imageToBase64(payload.image);
  await api.put(bannerDetailPath(id), {
    title: payload.title,
    image: base64Image,
    status: payload.status,
  });
};

export const deleteBannerApi = async (id: string): Promise<void> => {
  await api.delete(bannerDetailPath(id));
};

export const toggleBannerStatusApi = async (
  id: string,
  current: BannerStatus,
): Promise<BannerStatus> => {
  const next: BannerStatus = current === "Active" ? "Inactive" : "Active";
  await api.patch(bannerDetailPath(id), { status: next });
  return next;
};
