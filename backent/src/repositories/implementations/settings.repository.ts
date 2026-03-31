import { ISettingsDocument, SettingsModel } from "../../models/Settings";
import { GlobalSettingsPayload } from "../../types/settings.types";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";

export class SettingsRepository implements ISettingsRepository {
  async getSingleton(): Promise<ISettingsDocument | null> {
    return SettingsModel.findOne();
  }

  async upsertSingleton(
    payload: GlobalSettingsPayload
  ): Promise<ISettingsDocument> {
    const existing = await SettingsModel.findOne();
    if (existing) {
      existing.whatsAppNumber = payload.whatsAppNumber;
      existing.adminEmail = payload.adminEmail;
      // Merge new notification emails with existing ones, avoiding duplicates
      const existingEmails = new Set(
        existing.notificationEmails.map((e) => e.toLowerCase())
      );
      const newEmails = payload.notificationEmails.map((e) => e.toLowerCase());
      const mergedEmails = Array.from(new Set([...existingEmails, ...newEmails]));
      existing.notificationEmails = mergedEmails;
      return existing.save();
    }

    const doc = new SettingsModel({
      whatsAppNumber: payload.whatsAppNumber,
      adminEmail: payload.adminEmail,
      notificationEmails: payload.notificationEmails,
    });
    return doc.save();
  }
}
