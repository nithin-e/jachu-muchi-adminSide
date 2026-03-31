import { EnquiryPayload, MailDispatchResult } from "../../types/Outreachtypes";

export interface IMailDispatchService {
  dispatchEnquiryMails(payload: EnquiryPayload): Promise<MailDispatchResult>;
}