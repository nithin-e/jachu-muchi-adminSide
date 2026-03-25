import { ArticleStatus, ARTICLE_STATUS_VALUES } from "../models/Article";
import {
  CreateArticleInput,
  UpdateArticleInput,
} from "../types/article.types";

function parseArticleDate(raw: unknown): Date | null {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  if (typeof raw !== "string" || !raw.trim()) return null;
  const parsed = new Date(raw.trim());
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const parts = raw.trim().split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts.map((p) => Number.parseInt(p, 10));
    if (y && m && d) {
      const ddmm = new Date(y, m - 1, d);
      if (!Number.isNaN(ddmm.getTime())) return ddmm;
    }
  }
  return null;
}

function normalizeStatus(raw: unknown): ArticleStatus | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim() as ArticleStatus;
  return ARTICLE_STATUS_VALUES.includes(s) ? s : null;
}

export function mapBodyToCreateArticleInput(
  body: Record<string, unknown>,
  imageUrl?: string
): CreateArticleInput {
  const title =
    (typeof body.title === "string" && body.title) ||
    (typeof body.articleTitle === "string" && body.articleTitle) ||
    "";

  const description =
    (typeof body.description === "string" && body.description) ||
    (typeof body.summary === "string" && body.summary) ||
    "";

  const articleDate =
    parseArticleDate(body.articleDate ?? body.date ?? body.publishedAt) ??
    new Date(NaN);

  const status =
    normalizeStatus(body.status) ?? ("Draft" as ArticleStatus);

  const explicitUrl =
    typeof body.imageUrl === "string" ? body.imageUrl : undefined;

  return {
    title,
    description,
    articleDate,
    status,
    ...(imageUrl
      ? { imageUrl }
      : explicitUrl?.trim()
        ? { imageUrl: explicitUrl.trim() }
        : {}),
  };
}

export function mapBodyToUpdateArticleInput(
  body: Record<string, unknown>,
  imageUrl?: string
): UpdateArticleInput {
  return mapBodyToCreateArticleInput(body, imageUrl) as UpdateArticleInput;
}
