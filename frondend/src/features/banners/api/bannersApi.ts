import { api, UPLOAD_TIMEOUT_MS } from "@lib/apiClient";
import { getImageUrl } from "@lib/imageUrl";
import type { BannerItem, BannerStatus } from "../types";

export const BANNERS_LIST_PATH = "/api/admin/banners";
export const bannerDetailPath = (id: string) => `/api/admin/banners/${id}`;

export const BANNER_IMAGE_MAX_SIZE_BYTES = 10 * 1024 * 1024;

const PRIMARY_BUTTON_LINK = "/courses";
const SECONDARY_BUTTON_LINK = "";

const isBannerRow = (x: unknown): x is BannerItem =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as BannerItem).id === "string" &&
  typeof (x as BannerItem).image === "string";

const toStatus = (raw: unknown): BannerStatus =>
  raw === "Active" || raw === "Inactive" ? (raw as BannerStatus) : "Active";

const rowToBanner = (raw: Record<string, unknown>): BannerItem => {
  const rawUrl = String(raw.imageUrl ?? raw.image ?? raw.url ?? "");
  const heading = String(raw.heading ?? "");
  return {
    id: String(raw._id ?? raw.id),
    heading,
    highlightedText: String(raw.highlightedText ?? ""),
    subtext: String(raw.subtext ?? ""),
    primaryButtonText: String(raw.primaryButtonText ?? ""),
    secondaryButtonText: String(raw.secondaryButtonText ?? ""),
    order: Number(raw.order ?? 0),
    status: toStatus(raw.status),
    image: getImageUrl(rawUrl, "banners"),
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

type BannersListResponse = {
  data?: unknown;
};

export const getBanners = async (): Promise<BannerItem[]> => {
  const res = await api.get<BannersListResponse>(`${BANNERS_LIST_PATH}/all?_limit=30`);

  const data = res.data?.data;

  if (!Array.isArray(data) || data.length === 0) return [];

  return (data as unknown[])
    .map((item) => rowToBanner(item as Record<string, unknown>))
    .sort((a, b) => a.order - b.order);
};

export const getBannerById = async (id: string): Promise<BannerItem | null> => {
  try {
    const res = await api.get<unknown>(bannerDetailPath(id));
    const body = res.data;
    const row =
      body && typeof body === "object" && "data" in body
        ? (body as Record<string, unknown>).data
        : body;
    if (row && typeof row === "object") {
      if (isBannerRow(row)) return row;
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
    heading: payload.heading,
    highlightedText: payload.highlightedText,
    subtext: payload.subtext,
    primaryButtonText: payload.primaryButtonText,
    primaryButtonLink: PRIMARY_BUTTON_LINK,
    secondaryButtonText: payload.secondaryButtonText,
    secondaryButtonLink: SECONDARY_BUTTON_LINK,
    order: payload.order,
    image: base64Image,
    status: payload.status,
  });
  const responseData =
    typeof (res.data as Record<string, unknown> | undefined)?.data === "object" &&
    (res.data as Record<string, unknown> | undefined)?.data !== null
      ? (res.data as Record<string, unknown>).data as Record<string, unknown>
      : (res.data as Record<string, unknown>);
  const id = responseData._id != null ? String(responseData._id) : responseData.id != null ? String(responseData.id) : Date.now().toString();
  return {
    id,
    heading: payload.heading,
    highlightedText: payload.highlightedText,
    subtext: payload.subtext,
    primaryButtonText: payload.primaryButtonText,
    secondaryButtonText: payload.secondaryButtonText,
    order: payload.order,
    status: payload.status,
    image: typeof responseData.imageUrl === "string" ? getImageUrl(responseData.imageUrl, "banners") : payload.image,
  };
};

export const updateBannerApi = async (id: string, payload: Omit<BannerItem, "id">): Promise<void> => {
  const base64Image = await imageToBase64(payload.image);
  await api.put(bannerDetailPath(id), {
    heading: payload.heading,
    highlightedText: payload.highlightedText,
    subtext: payload.subtext,
    primaryButtonText: payload.primaryButtonText,
    primaryButtonLink: PRIMARY_BUTTON_LINK,
    secondaryButtonText: payload.secondaryButtonText,
    secondaryButtonLink: SECONDARY_BUTTON_LINK,
    order: payload.order,
    image: base64Image,
    status: payload.status,
  });
};

export const deleteBannerApi = async (id: string): Promise<void> => {
  await api.delete(bannerDetailPath(id));
};

type UploadResponse = {
  data?: {
    filePath?: string;
  };
};

export const uploadBannerImage = async (
  file: File,
  onProgress?: (percentLoaded: number) => void,
): Promise<string> => {
  const formData = new FormData();
  formData.append("bannerImage", file);

  const res = await api.upload<UploadResponse>("/api/admin/banners/upload", formData, {
    timeoutMs: UPLOAD_TIMEOUT_MS,
    onUploadProgress: onProgress,
  });

  const filePath = res.data?.data?.filePath;
  if (!filePath) {
    throw new Error("Upload failed: no file URL returned by the server.");
  }

  return getImageUrl(filePath, "banners");
};
