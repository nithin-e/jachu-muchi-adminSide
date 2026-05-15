export interface EnquiryPayload {
  fullName: string;
  emailOrPhone: string;
  course: string;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  subject?: string; 
  notes?: string;
}

export interface MailDispatchResult {
  success: boolean;
  deliveredTo: string[];
  failedTo: string[];
  message: string;
}

// src/types/enquiry.ts

