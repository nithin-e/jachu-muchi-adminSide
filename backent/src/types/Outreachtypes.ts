export interface EnquiryPayload {
  fullName: string;
  emailOrPhone: string;  // Email or phone number
  course: string;
  message: string;
}

export interface MailDispatchResult {
  success: boolean;
  deliveredTo: string[];
  failedTo: string[];
  message: string;
}