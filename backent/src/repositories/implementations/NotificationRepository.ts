import { SettingsModel } from "../../models/Settings";
import { NotificationEmailModel } from "../../models/NotificationEmail";
import { INotificationRepository } from "../interfaces/INotificationRepository";

export class NotificationRepository implements INotificationRepository {
  async fetchAllRecipientEmails(): Promise<string[]> {
    const settings = await SettingsModel.findOne().lean();
    const emails = new Set<string>();

    if (settings?.adminEmail?.trim()) {
      emails.add(settings.adminEmail.trim());
    }

    const notificationEmails = await NotificationEmailModel.find().select("email").lean();
    notificationEmails.forEach((doc) => {
      if (doc.email?.trim()) {
        emails.add(doc.email.trim());
      }
    });

    return Array.from(emails);
  }
}
