export type EnquiryStatus = "New" | "Contacted" | "Interested" | "Converted" | "Closed";
export type EnquiryType = "course" | "general";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
  date: string;
  status: EnquiryStatus;
  type: EnquiryType;
  notes?: string;
}
