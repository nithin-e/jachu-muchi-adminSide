import { SaveSeoInput, SeoRecord } from "../../types/seo.types";

export interface ISeoService {
  listAll(): Promise<SeoRecord[]>;
  getByPageUrl(pageUrl: string): Promise<SeoRecord | null>;
  upsert(pageUrl: string, input: SaveSeoInput): Promise<SeoRecord>;
}
