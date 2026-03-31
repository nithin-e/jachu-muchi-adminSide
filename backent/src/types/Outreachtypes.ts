export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface MailDispatchResult {
  success: boolean;
  deliveredTo: string[];
  failedTo: string[];
  message: string;
}