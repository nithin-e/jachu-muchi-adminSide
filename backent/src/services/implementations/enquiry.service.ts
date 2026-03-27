import mongoose from "mongoose";
import {
  ENQUIRY_STATUS_VALUES,
  ENQUIRY_TYPE_VALUES,
  EnquiryStatus,
  IEnquiryDocument,
  EnquiryType,
} from "../../models/Enquiry";
import { IEnquiryRepository } from "../../repositories/interfaces/IEnquiryRepository";
import { throwBadRequest, throwNotFound } from "../../utils/http-errors.helper";
import { IEnquiryService } from "../interfaces/IEnquiryService";
import { MESSAGES } from "../../constants/messages";

export class EnquiryService implements IEnquiryService {
  constructor(private readonly enquiryRepository: IEnquiryRepository) {}

  async getAllEnquiries(): Promise<IEnquiryDocument[]> {
    return this.enquiryRepository.findAll();
  }

  async filterEnquiries(params: {
    page: number;
    limit: number;
    search?: string;
    status?: EnquiryStatus;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IEnquiryDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const { page, limit, search, status, type, sortBy, order } = params;

    if (!Number.isFinite(page) || page < 1) {
      throwBadRequest(MESSAGES.COMMON.PAGE_POSITIVE);
    }

    if (!Number.isFinite(limit) || limit < 1) {
      throwBadRequest(MESSAGES.COMMON.LIMIT_POSITIVE);
    }

    if (status && !ENQUIRY_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.ENQUIRY.INVALID_STATUS_VALUE);
    }

    let normalizedType: EnquiryType | undefined;
    if (type !== undefined) {
      if (typeof type !== "string" || !type.trim()) {
        throwBadRequest(
          MESSAGES.ENQUIRY.TYPE_MUST_BE_VALID_ENQUIRY_TYPE
        );
      }
      if (!ENQUIRY_TYPE_VALUES.includes(type as EnquiryType)) {
        throwBadRequest(MESSAGES.ENQUIRY.INVALID_TYPE_VALUE);
      }
      normalizedType = type as EnquiryType;
    }

    const safeSortBy =
      typeof sortBy === "string" && sortBy.trim() ? sortBy.trim() : undefined;

    const normalizedOrder =
      order === "asc" ? "asc" : order === "desc" ? "desc" : undefined;
    if (order !== undefined && normalizedOrder === undefined) {
      throwBadRequest(MESSAGES.COMMON.ORDER_ASC_DESC);
    }

    return this.enquiryRepository.filter({
      page,
      limit,
      search,
      status,
      type: normalizedType,
      sortBy: safeSortBy ?? "date",
      order: normalizedOrder ?? "desc",
    });
  }

  async updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus
  ): Promise<IEnquiryDocument> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      throwBadRequest(MESSAGES.ENQUIRY.INVALID_ID);
    }

    if (!ENQUIRY_STATUS_VALUES.includes(status)) {
      throwBadRequest(MESSAGES.ENQUIRY.INVALID_STATUS_VALUE);
    }

    const updated = await this.enquiryRepository.updateStatusById(enquiryId, status);
    if (!updated) {
      throwNotFound(MESSAGES.ENQUIRY.NOT_FOUND);
    }

    return updated;
  }

  async getEnquiryById(enquiryId: string): Promise<IEnquiryDocument> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      throwBadRequest(MESSAGES.ENQUIRY.INVALID_ID);
    }

    const doc = await this.enquiryRepository.findById(enquiryId);
    if (!doc) {
      throwNotFound(MESSAGES.ENQUIRY.NOT_FOUND);
    }
    return doc;
  }

  async updateEnquiryNotes(
    enquiryId: string,
    notes: string
  ): Promise<IEnquiryDocument> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      throwBadRequest(MESSAGES.ENQUIRY.INVALID_ID);
    }

    const trimmed = notes?.trim() ?? "";

    const updated = await this.enquiryRepository.updateNotesById(
      enquiryId,
      trimmed
    );
    if (!updated) {
      throwNotFound(MESSAGES.ENQUIRY.NOT_FOUND);
    }

    return updated;
  }

  async deleteEnquiry(enquiryId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      throwBadRequest(MESSAGES.ENQUIRY.INVALID_ID);
    }

    const removed = await this.enquiryRepository.deleteById(enquiryId);
    if (!removed) {
      throwNotFound(MESSAGES.ENQUIRY.NOT_FOUND);
    }
  }
}
