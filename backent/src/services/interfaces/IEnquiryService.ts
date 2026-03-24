import { EnquiryStatus, IEnquiryDocument } from "../../models/Enquiry";

export interface IEnquiryService {
  updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus
  ): Promise<IEnquiryDocument>;
}
