import mongoose from "mongoose";
import {
  ENQUIRY_STATUS_VALUES,
  EnquiryStatus,
  IEnquiryDocument,
} from "../../models/Enquiry";
import { IEnquiryRepository } from "../../repositories/interfaces/IEnquiryRepository";
import { IEnquiryService } from "../interfaces/IEnquiryService";

export class EnquiryService implements IEnquiryService {
  constructor(private readonly enquiryRepository: IEnquiryRepository) {}

  async updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus
  ): Promise<IEnquiryDocument> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      const error = new Error("Invalid enquiry id");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    if (!ENQUIRY_STATUS_VALUES.includes(status)) {
      const error = new Error("Invalid status value");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    const updated = await this.enquiryRepository.updateStatusById(enquiryId, status);
    if (!updated) {
      const error = new Error("Enquiry not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    return updated;
  }
}
