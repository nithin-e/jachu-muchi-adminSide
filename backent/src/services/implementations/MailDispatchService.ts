import { Transporter } from "nodemailer";
import { IMailDispatchService } from "../interfaces/IMailDispatchService";
import { EnquiryPayload, MailDispatchResult } from "../../types/Outreachtypes";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class MailDispatchService implements IMailDispatchService {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly transporter: Transporter
  ) {}

  async dispatchEnquiryMails(payload: EnquiryPayload): Promise<MailDispatchResult> {
    const recipients = await this.notificationRepository.fetchAllRecipientEmails();

    const validRecipients = recipients.filter((email) => email && emailRegex.test(email));

    if (validRecipients.length === 0) {
      return {
        success: false,
        deliveredTo: [],
        failedTo: [],
        message: "No valid recipient emails found in settings.",
      };
    }

    const deliveredTo: string[] = [];
    const failedTo: string[] = [];

    const adminHtml = this.buildAdminNotificationHtml(payload);
    const subject = `New Enquiry from ${payload.fullName}`;

    await Promise.allSettled(
      validRecipients.map(async (recipientEmail) => {
        try {
          await this.transporter.sendMail({
            from: `"V Trust Enquiry" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject,
            html: adminHtml,
          });
          deliveredTo.push(recipientEmail);
          console.log(`[MailDispatchService] Sent to admin: ${recipientEmail}`);
        } catch (err) {
          console.error(`[MailDispatchService] Failed to send to ${recipientEmail}:`, err);
          failedTo.push(recipientEmail);
        }
      })
    );

    if (payload.email && emailRegex.test(payload.email)) {
      try {
        const confirmationHtml = this.buildConfirmationHtml(payload);
        await this.transporter.sendMail({
          from: `"V Trust" <${process.env.SMTP_USER}>`,
          to: payload.email,
          subject: "Thank you for your enquiry — V Trust",
          html: confirmationHtml,
        });
        console.log(`[MailDispatchService] Confirmation sent to enquirer: ${payload.email}`);
      } catch (err) {
        console.error(`[MailDispatchService] Failed to send confirmation to ${payload.email}:`, err);
      }
    }

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

  async sendNotesEmail(payload: EnquiryPayload): Promise<MailDispatchResult> {
    const recipients = await this.notificationRepository.fetchAllRecipientEmails();
    const validRecipients = recipients.filter((email) => email && emailRegex.test(email));

    const deliveredTo: string[] = [];
    const failedTo: string[] = [];

    if (validRecipients.length > 0) {
      const adminNotesHtml = this.buildAdminNotesHtml(payload);
      const subject = `Notes Added: Enquiry from ${payload.fullName}`;

      await Promise.allSettled(
        validRecipients.map(async (recipientEmail) => {
          try {
            await this.transporter.sendMail({
              from: `"V Trust Enquiry" <${process.env.SMTP_USER}>`,
              to: recipientEmail,
              subject,
              html: adminNotesHtml,
            });
            deliveredTo.push(recipientEmail);
            console.log(`[MailDispatchService] Notes email sent to admin: ${recipientEmail}`);
          } catch (err) {
            console.error(`[MailDispatchService] Failed to send notes email to ${recipientEmail}:`, err);
            failedTo.push(recipientEmail);
          }
        })
      );
    }

    if (payload.email && emailRegex.test(payload.email)) {
      try {
        const userNotesHtml = this.buildUserNotesHtml(payload);
        await this.transporter.sendMail({
          from: `"V Trust" <${process.env.SMTP_USER}>`,
          to: payload.email,
          subject: "Update on your enquiry — V Trust",
          html: userNotesHtml,
        });
        console.log(`[MailDispatchService] Notes email sent to enquirer: ${payload.email}`);
      } catch (err) {
        console.error(`[MailDispatchService] Failed to send notes email to ${payload.email}:`, err);
      }
    }

    const success = deliveredTo.length > 0;

    return {
      success,
      deliveredTo,
      failedTo,
      message: success
        ? `Notes email dispatched to ${deliveredTo.length} recipient(s).`
        : "Failed to deliver notes email to all recipients.",
    };
  }

  private buildAdminNotificationHtml(payload: EnquiryPayload): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 8px;">New Enquiry Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; width: 30%;">Full Name</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.fullName)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Phone</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.phone)}</td>
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

  private buildConfirmationHtml(payload: EnquiryPayload): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 8px;">Thank You, ${this.escape(payload.fullName)}!</h2>
        <p style="color: #555; margin-top: 16px;">We have received your enquiry and our admissions team will contact you shortly.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; width: 30%;">Course</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.course)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Your Message</td>
            <td style="padding: 8px; color: #333; white-space: pre-line;">${this.escape(payload.message)}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; font-size: 14px; color: #4f46e5; font-weight: bold;">— V Trust Team</p>
      </div>
    `;
  }

  private buildAdminNotesHtml(payload: EnquiryPayload): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">Notes Added to Enquiry</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; width: 30%;">Full Name</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.fullName)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Phone</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.phone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Course</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.course)}</td>
          </tr>
          <tr style="background: #fffbeb;">
            <td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Notes</td>
            <td style="padding: 8px; color: #333; white-space: pre-line;">${this.escape(payload.notes || "")}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #aaa;">This email was sent automatically from your enquiry management system.</p>
      </div>
    `;
  }

  private buildUserNotesHtml(payload: EnquiryPayload): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 8px;">Update on Your Enquiry</h2>
        <p style="color: #555; margin-top: 16px;">Dear ${this.escape(payload.fullName)},</p>
        <p style="color: #555;">Our team has added an update to your enquiry. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; width: 30%;">Course</td>
            <td style="padding: 8px; color: #333;">${this.escape(payload.course)}</td>
          </tr>
          <tr style="background: #f0f7ff;">
            <td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Response</td>
            <td style="padding: 8px; color: #333; white-space: pre-line;">${this.escape(payload.notes || "")}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; color: #555;">If you have any questions, please feel free to reach out to us.</p>
        <p style="margin-top: 24px; font-size: 14px; color: #4f46e5; font-weight: bold;">— V Trust Team</p>
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
