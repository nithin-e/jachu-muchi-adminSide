import { ISettingsDocument } from "../../models/Settings";
import { INotificationEmailDocument } from "../../models/NotificationEmail";
import { SaveSettingsInput, UpdateAdminEmailInput, UpdateNotificationEmailsInput, UpdatePasswordInput } from "../../types/settings.types";

export interface ISettingsService {
  getSettings(): Promise<ISettingsDocument>;
  saveSettings(input: SaveSettingsInput): Promise<ISettingsDocument>;
  addNotificationEmail(email: string): Promise<INotificationEmailDocument>;
  getNotificationEmails(): Promise<INotificationEmailDocument[]>;
  deleteNotificationEmail(id: string): Promise<void>;
  updateAdminEmail(input: UpdateAdminEmailInput): Promise<ISettingsDocument>;
  updateNotificationEmails(input: UpdateNotificationEmailsInput): Promise<void>;
  updatePassword(input: UpdatePasswordInput): Promise<void>;
}
