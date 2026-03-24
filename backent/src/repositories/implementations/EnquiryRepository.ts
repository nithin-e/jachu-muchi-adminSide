import { EnquiryModel, EnquiryStatus, IEnquiryDocument } from "../../models/Enquiry";
import { IEnquiryRepository } from "../interfaces/IEnquiryRepository";

export class EnquiryRepository implements IEnquiryRepository {
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
}
