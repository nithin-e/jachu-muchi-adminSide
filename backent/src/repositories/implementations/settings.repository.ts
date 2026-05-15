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
      existing.adminEmail = payload.adminEmail;
      return existing.save();
    }

    const doc = new SettingsModel({
      adminEmail: payload.adminEmail,
    });
    return doc.save();
  }

  async updatePasswordHash(passwordHash: string): Promise<ISettingsDocument | null> {
    const existing = await SettingsModel.findOne();
    if (existing) {
      existing.passwordHash = passwordHash;
      return existing.save();
    }

    const doc = new SettingsModel({
      adminEmail: "",
      passwordHash,
    });
    return doc.save();
  }

  async getPasswordHash(): Promise<string | null> {
    const existing = await SettingsModel.findOne().select("passwordHash").lean();
    return existing?.passwordHash ?? null;
  }
}
