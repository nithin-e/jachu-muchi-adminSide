import { ContactEnquiryPayload } from "../../types/contactEnquiry.types";

export interface IContactEnquiryService {
  sendEnquiry(payload: ContactEnquiryPayload): Promise<void>;
}
