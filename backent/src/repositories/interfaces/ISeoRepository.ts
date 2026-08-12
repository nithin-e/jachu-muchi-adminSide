import { ISeoMetaDocument } from "../../models/SeoMeta";
import { SaveSeoInput } from "../../types/seo.types";

export interface ISeoRepository {
  findAll(): Promise<ISeoMetaDocument[]>;
  findByPageUrl(pageUrl: string): Promise<ISeoMetaDocument | null>;
  upsertByPageUrl(
    pageUrl: string,
    input: SaveSeoInput
  ): Promise<ISeoMetaDocument>;
}
