export interface EnquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  course: string;
  name?: string;
  message: string;
  subject?: string;
  type?: "course_enquiry" | "general";
  notes?: string;
}

export interface MailDispatchResult {
  success: boolean;
  deliveredTo: string[];
  failedTo: string[];
  message: string;
}

