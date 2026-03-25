import { EnquiryStatus, IEnquiryDocument } from "../../models/Enquiry";

export interface IEnquiryService {
  getAllEnquiries(): Promise<IEnquiryDocument[]>;

  filterEnquiries(params: {
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
  }>;

  updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus
  ): Promise<IEnquiryDocument>;

  getEnquiryById(enquiryId: string): Promise<IEnquiryDocument>;

  updateEnquiryNotes(
    enquiryId: string,
    notes: string
  ): Promise<IEnquiryDocument>;

  deleteEnquiry(enquiryId: string): Promise<void>;
}
