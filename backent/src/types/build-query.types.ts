export type Primitive = string | number | boolean | Date;

export type QueryParams = Record<string, unknown>;

export interface BuildQueryResult<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}
