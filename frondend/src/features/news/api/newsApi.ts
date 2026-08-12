import { api, UPLOAD_TIMEOUT_MS } from "@lib/apiClient";
import { getImageUrl } from "@lib/imageUrl";
import type { NewsItem } from "../types";

export const NEWS_LIST_PATH = "/api/articles/all";
export const newsDetailPath = (id: string) => `/api/admin/articles/${id}`;

export const NEWS_IMAGE_MAX_SIZE_BYTES = 10 * 1024 * 1024;

type ArticleApiRow = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  details?: string;
  articleDate?: string | Date;
  status?: string;
  imageUrl?: string;
  createdAt?: string | Date;
};

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

const isArticleApiRow = (x: unknown): x is ArticleApiRow =>
  isRecord(x) &&
  typeof x.title === "string" &&
  typeof x.description === "string";

const toStatus = (raw: unknown): NewsItem["status"] =>
  raw === "Published" || raw === "Draft" ? raw : "Draft";

const toDateString = (raw: string | Date | undefined): string => {
  if (!raw) return new Date().toISOString().split("T")[0];
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().split("T")[0];
  return date.toISOString().split("T")[0];
};

const mapArticleToNewsItem = (row: ArticleApiRow): NewsItem => ({
  id: String(row._id ?? row.id ?? ""),
  title: row.title,
  description: row.description,
  details: row.details ?? "",
  articleDate: toDateString(row.articleDate ?? row.createdAt),
  status: toStatus(row.status),
  imageUrl: getImageUrl(row.imageUrl, "articles"),
});

export const rowToNewsItem = (raw: Record<string, unknown>): NewsItem => ({
  id: String(raw.id ?? raw._id ?? ""),
  title: String(raw.title ?? ""),
  description: String(raw.description ?? raw.body ?? raw.content ?? ""),
  details: String(raw.details ?? raw.body ?? raw.content ?? ""),
  articleDate: toDateString(
    (raw.articleDate as string | Date | undefined) ??
      (raw.date as string | Date | undefined) ??
      (raw.createdAt as string | Date | undefined),
  ),
  status: toStatus(raw.status),
  imageUrl: getImageUrl(
    typeof raw.imageUrl === "string"
      ? raw.imageUrl
      : typeof raw.image === "string"
        ? raw.image
        : "",
    "articles",
  ),
});

const isLikelyNewsItemRow = (x: unknown): x is Record<string, unknown> =>
  isRecord(x) &&
  "title" in x &&
  ("description" in x || "body" in x || "date" in x);

const unwrapResponseData = (response: unknown): unknown => {
  if (isRecord(response) && "data" in response) return response.data;
  return response;
};

export const getNews = async (): Promise<NewsItem[]> => {
  const res = await api.get<unknown>(NEWS_LIST_PATH);
  const data = unwrapResponseData(res.data);
  if (!Array.isArray(data) || data.length === 0) return [];
  const first = data[0];
  if (isArticleApiRow(first)) {
    return (data as ArticleApiRow[]).map(mapArticleToNewsItem);
  }
  if (isLikelyNewsItemRow(first)) {
    return data.map((item) => rowToNewsItem(item as Record<string, unknown>));
  }
  console.warn(
    "[news.service] Unrecognized news list shape; attempting generic rowToNewsItem.",
    first,
  );
  try {
    return data.map((item) => rowToNewsItem(item as Record<string, unknown>));
  } catch (e) {
    console.warn("[news.service] Generic mapping failed.", e);
    return [];
  }
};

export const getNewsById = async (id: string): Promise<NewsItem | null> => {
  try {
    const res = await api.get<unknown>(newsDetailPath(id));
    const row = unwrapResponseData(res.data);
    if (!isRecord(row)) return null;
    if (isArticleApiRow(row)) return mapArticleToNewsItem(row);
    return rowToNewsItem(row);
  } catch {
    return null;
  }
};

const buildNewsPayload = (payload: Omit<NewsItem, "id">) => ({
  title: payload.title,
  description: payload.description,
  details: payload.details,
  articleDate: payload.articleDate,
  status: payload.status,
  imageUrl: payload.imageUrl,
});

export const createNews = async (payload: Omit<NewsItem, "id">): Promise<NewsItem> => {
  const res = await api.post<unknown>("/api/admin/articles", buildNewsPayload(payload));
  const data = unwrapResponseData(res.data);
  const record = isRecord(data) ? data : {};
  const newId = record._id != null ? String(record._id) : record.id != null ? String(record.id) : Date.now().toString();
  return {
    id: String(newId),
    title: typeof record.title === "string" ? record.title : payload.title,
    description: typeof record.description === "string" ? record.description : payload.description,
    details: typeof record.details === "string" ? record.details : payload.details,
    articleDate: toDateString((record.articleDate as string | Date | undefined) ?? payload.articleDate),
    status: toStatus(record.status),
    imageUrl: getImageUrl(
      typeof record.imageUrl === "string" ? record.imageUrl : payload.imageUrl,
      "articles",
    ),
  };
};

export const updateNews = async (id: string, payload: Omit<NewsItem, "id">): Promise<NewsItem> => {
  const res = await api.put<unknown>(newsDetailPath(id), buildNewsPayload(payload));
  const data = unwrapResponseData(res.data);
  const record = isRecord(data) ? data : {};
  return {
    id: typeof record._id === "string" ? record._id : id,
    title: typeof record.title === "string" ? record.title : payload.title,
    description: typeof record.description === "string" ? record.description : payload.description,
    details: typeof record.details === "string" ? record.details : payload.details,
    articleDate: toDateString((record.articleDate as string | Date | undefined) ?? payload.articleDate),
    status: toStatus(record.status),
    imageUrl: getImageUrl(
      typeof record.imageUrl === "string" ? record.imageUrl : payload.imageUrl,
      "articles",
    ),
  };
};

export const deleteNews = async (id: string): Promise<void> => {
  await api.delete(newsDetailPath(id));
};

type UploadResponse = {
  data?: {
    filePath?: string;
  };
};

export const uploadNewsImage = async (
  file: File,
  onProgress?: (percentLoaded: number) => void,
): Promise<string> => {
  const formData = new FormData();
  formData.append("articleImage", file);

  const res = await api.upload<UploadResponse>("/api/admin/articles/upload", formData, {
    timeoutMs: UPLOAD_TIMEOUT_MS,
    onUploadProgress: onProgress,
  });

  const filePath = res.data?.data?.filePath;
  if (!filePath) {
    throw new Error("Upload failed: no file URL returned by the server.");
  }

  return getImageUrl(filePath, "articles");
};
