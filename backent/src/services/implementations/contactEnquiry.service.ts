import nodemailer, { Transporter } from "nodemailer";
import { IContactEnquiryService } from "../interfaces/IContactEnquiryService";
import { IEnquiryRepository } from "../../repositories/interfaces/IEnquiryRepository";
import { ContactEnquiryPayload } from "../../types/contactEnquiry.types";

const RECIPIENT_EMAIL = "vtrustcollege@gmail.com";

export class ContactEnquiryService implements IContactEnquiryService {
  private readonly transporter: Transporter | null;

  constructor(private readonly enquiryRepository: IEnquiryRepository) {
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!user || !pass) {
      console.warn(
        "[ContactEnquiryService] EMAIL_USER and EMAIL_PASS not set; email dispatch disabled."
      );
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user, pass },
    });
  }

  async sendEnquiry(payload: ContactEnquiryPayload): Promise<void> {
    await this.enquiryRepository.create({
      name: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      course: payload.subject,
      message: payload.message,
      type: "general",
      status: "New",
    });

    if (!this.transporter) return;

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

    try {
      await this.transporter.sendMail({
        from: `"Contact Enquiry" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
        to: RECIPIENT_EMAIL,
        subject,
        text,
      });
    } catch (error) {
      console.error(
        "[ContactEnquiryService] Failed to send email (enquiry already saved):",
        error
      );
    }
  }
}
