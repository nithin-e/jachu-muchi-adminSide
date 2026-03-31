import { Transporter } from "nodemailer";
import { IMailDispatchService } from "../interfaces/IMailDispatchService";
import { EnquiryPayload, MailDispatchResult } from "../../types/Outreachtypes";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";

export class MailDispatchService implements IMailDispatchService {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly transporter: Transporter
  ) {}

  async dispatchEnquiryMails(payload: EnquiryPayload): Promise<MailDispatchResult> {
    const recipients = await this.notificationRepository.fetchAllRecipientEmails();
  
    

    if (recipients.length === 0) {
      return {
        success: false,
        deliveredTo: [],
        failedTo: [],
        message: "No recipient emails found in settings.",
      };
    }

    const deliveredTo: string[] = [];
    const failedTo: string[] = [];

    const htmlBody = this.buildEmailHtml(payload);

   
    

    // Send to every recipient independently so one failure doesn't block others
    await Promise.allSettled(
      recipients.map(async (recipientEmail) => {
        try {
          await this.transporter.sendMail({
            from: `"Enquiry Form" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: payload.subject || `New Enquiry from ${payload.name}`,
            html: htmlBody,
          });
          deliveredTo.push(recipientEmail);
          console.log('okey aaahnu broooo',deliveredTo);
          
        } catch (err) {
          console.error(`[MailDispatchService] Failed to send to ${recipientEmail}:`, err);
          failedTo.push(recipientEmail);
        }
      })
    );

    const success = deliveredTo.length > 0;

    return {
      success,
      deliveredTo,
      failedTo,
      message: success
        ? `Enquiry mail dispatched to ${deliveredTo.length} recipient(s).`
        : "Failed to deliver to all recipients.",
    };
  }

  private buildEmailHtml(payload: EnquiryPayload): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 8px;">New Enquiry Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; width: 30%;">Full Name</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.fullName)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Email or Phone</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.emailOrPhone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Course</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.course)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Message</td>
            <td style="padding: 8px; color: #333; white-space: pre-line;">${this.escape(payload.message)}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #aaa;">This email was sent automatically from your website enquiry form.</p>
      </div>
    `;
  }

  private escape(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}