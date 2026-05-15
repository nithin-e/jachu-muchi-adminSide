import {
  EnquiryStatus,
  EnquiryType,
  IEnquiryDocument,
} from "../../models/Enquiry";

export interface CreateEnquiryPayload {
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
  type?: EnquiryType;
  status?: EnquiryStatus;
}

export interface IEnquiryRepository {
  create(payload: CreateEnquiryPayload): Promise<IEnquiryDocument>;
  findAll(): Promise<IEnquiryDocument[]>;
  findById(enquiryId: string): Promise<IEnquiryDocument | null>;

  filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: EnquiryStatus;
    type?: EnquiryType;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IEnquiryDocument[];
    total: number;
    page: number;
    pages: number;
  }>;

  updateStatusById(
    enquiryId: string,
    status: EnquiryStatus
  ): Promise<IEnquiryDocument | null>;

  updateNotesById(
    enquiryId: string,
    notes: string
  ): Promise<IEnquiryDocument | null>;

  deleteById(enquiryId: string): Promise<IEnquiryDocument | null>;
}
