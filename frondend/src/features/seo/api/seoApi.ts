import { api } from "@lib/apiClient";
import type { SeoFormValues, SeoMeta } from "../types";

export const SEO_LIST_PATH = "/api/seo";
export const seoPageUrlQueryPath = (pageUrl: string) =>
  `/api/seo?pageUrl=${encodeURIComponent(pageUrl)}`;

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);

const mapApiRowToSeoMeta = (row: Record<string, unknown>): SeoMeta => ({
  id: String(row._id ?? row.id ?? ""),
  pageUrl: String(row.pageUrl ?? ""),
  metaTitle: String(row.metaTitle ?? ""),
  metaDescription: String(row.metaDescription ?? ""),
  metaKeywords: String(row.metaKeywords ?? ""),
});

export const getSeoRecords = async (): Promise<SeoMeta[]> => {
  const res = await api.get<unknown>(SEO_LIST_PATH);
  const response = res.data;
  const data = isRecord(response) ? response.data : undefined;
  if (!Array.isArray(data)) return [];
  return (data as unknown[]).filter(isRecord).map(mapApiRowToSeoMeta);
};

export const getSeoByPageUrl = async (pageUrl: string): Promise<SeoMeta | null> => {
  const res = await api.get<unknown>(seoPageUrlQueryPath(pageUrl));
  const response = res.data;
  const row = isRecord(response) ? response.data : undefined;
  if (!isRecord(row)) return null;
  return mapApiRowToSeoMeta(row);
};

export const upsertSeo = async (
  pageUrl: string,
  values: SeoFormValues,
): Promise<SeoMeta> => {
  const res = await api.put<{ data: unknown }>(SEO_LIST_PATH, {
    pageUrl,
    ...values,
  });
  const row = res.data?.data;
  if (!isRecord(row)) {
    throw new Error("Unexpected upsert response");
  }
  return mapApiRowToSeoMeta(row);
};
