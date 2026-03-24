import { Model } from "mongoose";

type Primitive = string | number | boolean | Date;

type QueryParams = Record<string, unknown>;

interface BuildQueryResult<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

const RESERVED_PARAMS = new Set(["search", "sort", "page", "limit"]);

const toRegex = (value: string) => ({ $regex: value, $options: "i" });

const parsePage = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

const parseLimit = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 10;
  return Math.min(Math.floor(parsed), 100);
};

const parseSort = <T>(
  model: Model<T>,
  sortRaw: unknown
): Record<string, 1 | -1> => {
  const defaultSort: Record<string, 1 | -1> = { createdAt: -1 };
  if (!sortRaw || typeof sortRaw !== "string") return defaultSort;

  const [field, order] = sortRaw.split("_");
  if (!field || !model.schema.path(field)) return defaultSort;

  return { [field]: order === "asc" ? 1 : -1 };
};

const castValueFromSchemaType = (
  schemaTypeName: string | undefined,
  rawValue: unknown
): Primitive | null => {
  if (typeof rawValue !== "string") return null;
  const value = rawValue.trim();
  if (!value) return null;

  if (schemaTypeName === "Number") {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  if (schemaTypeName === "Boolean") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
    return null;
  }

  if (schemaTypeName === "Date") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return value;
};

export const buildQuery = async <T>(
  model: Model<T>,
  queryParams: QueryParams,
  searchFields: string[]
): Promise<BuildQueryResult<T>> => {
  const page = parsePage(queryParams.page);
  const limit = parseLimit(queryParams.limit);
  const skip = (page - 1) * limit;
  const sort = parseSort(model, queryParams.sort);

  const mongoQuery: Record<string, unknown> = {};

  const searchValue =
    typeof queryParams.search === "string" ? queryParams.search.trim() : "";

  if (searchValue) {
    const validSearchFields = searchFields.filter((field) =>
      Boolean(model.schema.path(field))
    );

    if (validSearchFields.length > 0) {
      mongoQuery.$or = validSearchFields.map((field) => ({
        [field]: toRegex(searchValue),
      }));
    }
  }

  Object.entries(queryParams).forEach(([key, rawValue]) => {
    if (RESERVED_PARAMS.has(key)) return;
    if (rawValue === undefined || rawValue === null || rawValue === "") return;

    const schemaPath = model.schema.path(key);
    if (!schemaPath) return;

    const value = castValueFromSchemaType(
      (schemaPath as { instance?: string }).instance,
      rawValue
    );
    if (value === null) return;

    mongoQuery[key] = value;
  });

  const [data, total] = await Promise.all([
    model.find(mongoQuery).sort(sort).skip(skip).limit(limit).lean(),
    model.countDocuments(mongoQuery),
  ]);

  return {
    data: data as T[],
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
};
