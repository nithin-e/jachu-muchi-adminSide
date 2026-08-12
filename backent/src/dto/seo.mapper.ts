import { ISeoMetaDocument } from "../models/SeoMeta";
import { SaveSeoInput, SeoRecord } from "../types/seo.types";

export function mapBodyToSaveSeoInput(
  body: Record<string, unknown>
): SaveSeoInput {
  const metaTitle =
    typeof body.metaTitle === "string" ? body.metaTitle.trim() : "";
  const metaDescription =
    typeof body.metaDescription === "string"
      ? body.metaDescription.trim()
      : "";
  const metaKeywords =
    typeof body.metaKeywords === "string" ? body.metaKeywords.trim() : "";

  return { metaTitle, metaDescription, metaKeywords };
}

export function toSeoRecord(doc: ISeoMetaDocument): SeoRecord {
  return {
    id: String(doc._id),
    pageUrl: doc.pageUrl,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    metaKeywords: doc.metaKeywords,
  };
}
