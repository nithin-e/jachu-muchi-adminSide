import nodemailer from "nodemailer";
import { IContactEnquiryService } from "../interfaces/IContactEnquiryService";
import { ContactEnquiryPayload } from "../../types/contactEnquiry.types";

const RECIPIENT_EMAIL = "vtrustcollege@gmail.com";

export class ContactEnquiryService implements IContactEnquiryService {
  private transporter;

  constructor() {
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!user || !pass) {
      throw new Error(
        "[ContactEnquiryService] EMAIL_USER and EMAIL_PASS must be set in .env"
      );
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user, pass },
    });
  }

  async sendEnquiry(payload: ContactEnquiryPayload): Promise<void> {
    const subject = `New Contact Enquiry - ${payload.subject}`;
    const text = [
      "New Contact Enquiry",
      "",
      `Full Name: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Subject: ${payload.subject}`,
      "",
      "Message:",
      payload.message,
      "",
      "Submitted Time:",
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    ].join("\n");

    await this.transporter.sendMail({
      from: `"Contact Enquiry" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      subject,
      text,
    });
  }
}
