import { EnquiryStatus, IEnquiryDocument } from "../../models/Enquiry";

export interface IEnquiryRepository {
  updateStatusById(
    enquiryId: string,
    status: EnquiryStatus
  ): Promise<IEnquiryDocument | null>;
}
