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
      existing.notificationEmails = payload.notificationEmails;
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
