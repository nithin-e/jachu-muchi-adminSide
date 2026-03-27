import {
  EnquiryModel,
  ENQUIRY_TYPE_VALUES,
  EnquiryStatus,
  IEnquiryDocument,
} from "../../models/Enquiry";
import { IEnquiryRepository } from "../interfaces/IEnquiryRepository";

function normalizeForSearch(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collapseRepeatedChars(input: string): string {
  return input.replace(/(.)\1+/g, "$1");
}

function scoreValue(value: string, normalizedSearch: string): number {
  const normalizedValue = normalizeForSearch(value);
  if (!normalizedValue) return 0;

  if (normalizedValue === normalizedSearch) return 300;
  if (normalizedValue.startsWith(normalizedSearch)) return 200;
  if (normalizedValue.includes(normalizedSearch)) return 100;

  const collapsedValue = collapseRepeatedChars(normalizedValue);
  const collapsedSearch = collapseRepeatedChars(normalizedSearch);

  if (collapsedValue === collapsedSearch) return 90;
  if (collapsedValue.startsWith(collapsedSearch)) return 80;
  if (collapsedValue.includes(collapsedSearch)) return 70;

  return 0;
}

function scoreDocument(doc: IEnquiryDocument, normalizedSearch: string): number {
  const searchableValues = [doc.name, doc.phone, doc.email, doc.type, doc.message];
  let max = 0;
  for (const value of searchableValues) {
    const score = scoreValue(String(value ?? ""), normalizedSearch);
    if (score > max) max = score;
  }
  return max;
}

export class EnquiryRepository implements IEnquiryRepository {
  async findAll(): Promise<IEnquiryDocument[]> {
    return EnquiryModel.find()
      .sort({ createdAt: -1 })
      .lean();
  }

  async findById(enquiryId: string): Promise<IEnquiryDocument | null> {
    return EnquiryModel.findById(enquiryId);
  }

  async filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: EnquiryStatus;
    type?: (typeof ENQUIRY_TYPE_VALUES)[number];
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IEnquiryDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const {
      page,
      limit,
      search,
      status,
      type,
      sortBy,
      order = "desc",
    } = params;

    const skip = (page - 1) * limit;
    const mongoQuery: any = {};

    if (status) mongoQuery.status = status;
    if (type) mongoQuery.type = type;

    const rawSearch = search?.trim() ?? "";
    const specialChars = (rawSearch.match(/[^a-zA-Z0-9\s]/g) ?? []).length;
    const hasTooManySpecialChars =
      rawSearch.length > 0 && specialChars / rawSearch.length > 0.35;
    const normalizedSearch = normalizeForSearch(rawSearch);
    const applySearch =
      !hasTooManySpecialChars &&
      normalizedSearch.length >= 3 &&
      normalizedSearch.length > 0;

    const sortFieldCandidate = sortBy?.trim() || "date";
    const mappedSortField =
      sortFieldCandidate === "date" ? "createdAt" : sortFieldCandidate;
    const sortField =
      EnquiryModel.schema.path(mappedSortField) ||
      mappedSortField === "createdAt"
        ? mappedSortField
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    if (!applySearch) {
      const total = await EnquiryModel.countDocuments(mongoQuery);
      const pages = Math.ceil(total / limit);

      const data = await EnquiryModel.find(mongoQuery)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean();

      return { data, total, page, pages };
    }

    // Search ranking path:
    // exact > startsWith > contains, and tolerant repeated-char matching.
    const candidates = await EnquiryModel.find(mongoQuery).lean();
    const ranked = candidates
      .map((doc) => ({
        doc,
        score: scoreDocument(doc as IEnquiryDocument, normalizedSearch),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aValue = (a.doc as any)[sortField];
        const bValue = (b.doc as any)[sortField];
        if (aValue === bValue) return 0;
        if (sortDirection === 1) return aValue > bValue ? 1 : -1;
        return aValue > bValue ? -1 : 1;
      });

    const total = ranked.length;
    const pages = Math.ceil(total / limit);
    const data = ranked
      .slice(skip, skip + limit)
      .map((item) => item.doc as IEnquiryDocument);

    return { data, total, page, pages };
  }

  async updateStatusById(
    enquiryId: string,
    status: EnquiryStatus
  ): Promise<IEnquiryDocument | null> {
    return EnquiryModel.findByIdAndUpdate(
      enquiryId,
      { status },
      { new: true }
    );
  }

  async updateNotesById(
    enquiryId: string,
    notes: string
  ): Promise<IEnquiryDocument | null> {
    return EnquiryModel.findByIdAndUpdate(
      enquiryId,
      { notes },
      { new: true }
    );
  }

  async deleteById(enquiryId: string): Promise<IEnquiryDocument | null> {
    return EnquiryModel.findByIdAndDelete(enquiryId);
  }
}
