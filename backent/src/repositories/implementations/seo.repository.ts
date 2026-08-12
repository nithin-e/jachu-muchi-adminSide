import { ISeoMetaDocument, SeoMetaModel } from "../../models/SeoMeta";
import { SaveSeoInput } from "../../types/seo.types";
import { ISeoRepository } from "../interfaces/ISeoRepository";

export class SeoRepository implements ISeoRepository {
  async findAll(): Promise<ISeoMetaDocument[]> {
    return SeoMetaModel.find().sort({ pageUrl: 1 });
  }

  async findByPageUrl(pageUrl: string): Promise<ISeoMetaDocument | null> {
    return SeoMetaModel.findOne({ pageUrl });
  }

  async upsertByPageUrl(
    pageUrl: string,
    input: SaveSeoInput
  ): Promise<ISeoMetaDocument> {
    return SeoMetaModel.findOneAndUpdate(
      { pageUrl },
      {
        $set: {
          pageUrl,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          metaKeywords: input.metaKeywords,
        },
      },
      { upsert: true, new: true }
    );
  }
}
