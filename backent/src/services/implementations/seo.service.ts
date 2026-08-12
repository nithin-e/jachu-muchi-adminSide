import { toSeoRecord } from "../../dto/seo.mapper";
import { ISeoRepository } from "../../repositories/interfaces/ISeoRepository";
import { SaveSeoInput, SeoRecord } from "../../types/seo.types";
import { throwBadRequest } from "../../utils/http-errors.helper";
import { MESSAGES } from "../../constants/messages";
import { ISeoService } from "../interfaces/ISeoService";

export class SeoService implements ISeoService {
  constructor(private readonly seoRepository: ISeoRepository) {}

  async listAll(): Promise<SeoRecord[]> {
    const docs = await this.seoRepository.findAll();
    return docs.map(toSeoRecord);
  }

  async getByPageUrl(pageUrl: string): Promise<SeoRecord | null> {
    const normalizedPageUrl = pageUrl?.trim() ?? "";
    if (!normalizedPageUrl) {
      throwBadRequest(MESSAGES.SEO.PAGE_URL_REQUIRED);
    }

    const doc = await this.seoRepository.findByPageUrl(normalizedPageUrl);
    return doc ? toSeoRecord(doc) : null;
  }

  async upsert(pageUrl: string, input: SaveSeoInput): Promise<SeoRecord> {
    const normalizedPageUrl = pageUrl?.trim() ?? "";
    if (!normalizedPageUrl) {
      throwBadRequest(MESSAGES.SEO.PAGE_URL_REQUIRED);
    }

    const doc = await this.seoRepository.upsertByPageUrl(
      normalizedPageUrl,
      input
    );
    return toSeoRecord(doc);
  }
}
