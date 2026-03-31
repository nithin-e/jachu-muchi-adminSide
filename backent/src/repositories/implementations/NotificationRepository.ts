import { SettingsModel } from "../../models/Settings";
import { INotificationRepository } from "../interfaces/INotificationRepository";

export class NotificationRepository implements INotificationRepository {
  /**
   * Fetches all unique recipient emails from the settings collection.
   * Combines adminEmail + all notificationEmails, removes duplicates and empty strings.
   */
  async fetchAllRecipientEmails(): Promise<string[]> {
    const settings = await SettingsModel.findOne().lean();

    if (!settings) {
      return [];
    }

    const emails = new Set<string>();

    if (settings.adminEmail?.trim()) {
      emails.add(settings.adminEmail.trim());
    }

    if (Array.isArray(settings.notificationEmails)) {
      settings.notificationEmails.forEach((email) => {
        if (email?.trim()) {
          emails.add(email.trim());
        }
      });
    }

    return Array.from(emails);
  }
}