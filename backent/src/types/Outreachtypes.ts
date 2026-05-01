export interface EnquiryPayload {
  fullName: string;
  emailOrPhone: string;  // Email or phone number
  course: string;
  name?: string;           // Required or make optional if sometimes missing
  email?: string;
  phone?: string;
  message: string;
  subject?: string; 
}

export interface MailDispatchResult {
  success: boolean;
  deliveredTo: string[];
  failedTo: string[];
  message: string;
}

// src/types/enquiry.ts

