import { api } from "../client";
import type { NewsItem } from "@/types";

export const NEWS_LIST_PATH = "/api/articles/all";
export const newsDetailPath = (id: string) => `/api/admin/articles/${id}`;

type ArticleApiRow = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category?: string;
  details?: string;
  articleDate?: string | Date;
  status?: string;
  imageUrl?: string;
  createdAt?: string | Date;
};

const isArticleApiRow = (x: unknown): x is ArticleApiRow =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as ArticleApiRow).title === "string" &&
  typeof (x as ArticleApiRow).description === "string";

const mapArticleToNewsItem = (row: ArticleApiRow): NewsItem => ({
  id: String(row._id ?? row.id ?? ""),
  title: row.title,
  description: row.description,
  details: row.details ?? undefined,
  image: row.imageUrl ?? "",
  date: row.articleDate
    ? new Date(row.articleDate).toISOString().split("T")[0]
    : row.createdAt
      ? new Date(row.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  status: row.status === "Published" || row.status === "Draft" ? row.status : "Draft",
});

export const rowToNewsItem = (raw: Record<string, unknown>): NewsItem => ({
  id: String(raw.id ?? raw._id ?? ""),
  title: String(raw.title ?? ""),
  description: String(raw.description ?? raw.body ?? raw.content ?? ""),
  details: typeof raw.details === "string" ? raw.details : undefined,
  image: typeof raw.imageUrl === "string"
    ? raw.imageUrl
    : typeof raw.image === "string"
      ? raw.image
      : "",
  date: typeof raw.articleDate === "string"
    ? raw.articleDate
    : typeof raw.date === "string"
      ? raw.date
      : new Date().toISOString().split("T")[0],
  status: raw.status === "Published" || raw.status === "Draft" ? raw.status : "Draft",
});

const isLikelyNewsItemRow = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" &&
  x !== null &&
  "title" in x &&
  ("description" in x || "body" in x || "date" in x);

export const getNews = async (): Promise<NewsItem[]> => {
  const res = await api.get<unknown>(NEWS_LIST_PATH);
  const response = res.data;
  const data = (response as any)?.data ?? response;
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
    const response = res.data;
    const row = (response as any)?.data ?? response;
    if (!row || typeof row !== "object") return null;
    if (isArticleApiRow(row)) return mapArticleToNewsItem(row);
    return rowToNewsItem(row as Record<string, unknown>);
  } catch {
    return null;
  }
};

export const createNews = async (payload: Omit<NewsItem, "id">): Promise<NewsItem> => {
  const res = await api.post<Record<string, unknown>>("/api/admin/articles", {
    title: payload.title,
    description: payload.description,
    category: "News",
    details: payload.description,
    articleDate: payload.date,
    status: payload.status,
    imageUrl: payload.image,
  });
  const response = res.data;
  const data = (response as any)?.data ?? response;
  const newId = data?._id ?? data?.id ?? Date.now().toString();
  return {
    id: String(newId),
    title: String(data?.title ?? payload.title),
    description: String(data?.description ?? payload.description),
    details: typeof data?.details === "string" ? data.details : undefined,
    image: data?.imageUrl ?? payload.image,
    date: String(data?.articleDate ?? payload.date),
    status: data?.status === "Published" || data?.status === "Draft" ? data.status : payload.status,
  };
};

export const updateNews = async (id: string, payload: Omit<NewsItem, "id">): Promise<NewsItem> => {
  const res = await api.put<Record<string, unknown>>(newsDetailPath(id), {
    title: payload.title,
    description: payload.description,
    category: "News",
    details: payload.description,
    articleDate: payload.date,
    status: payload.status,
    imageUrl: payload.image,
  });
  const response = res.data;
  const data = (response as any)?.data ?? response;
  return {
    id: String(data?._id ?? id),
    title: String(data?.title ?? payload.title),
    description: String(data?.description ?? payload.description),
    details: typeof data?.details === "string" ? data.details : undefined,
    image: data?.imageUrl ?? payload.image,
    date: String(data?.articleDate ?? payload.date),
    status: data?.status === "Published" || data?.status === "Draft" ? data.status : payload.status,
  };
};

export const deleteNews = async (id: string): Promise<void> => {
  await api.delete(newsDetailPath(id));
};