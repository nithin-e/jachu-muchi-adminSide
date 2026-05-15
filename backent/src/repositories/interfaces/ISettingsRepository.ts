import { ISettingsDocument } from "../../models/Settings";
import { GlobalSettingsPayload } from "../../types/settings.types";

export interface ISettingsRepository {
  getSingleton(): Promise<ISettingsDocument | null>;
  upsertSingleton(payload: GlobalSettingsPayload): Promise<ISettingsDocument>;
  updatePasswordHash(passwordHash: string): Promise<ISettingsDocument | null>;
  getPasswordHash(): Promise<string | null>;
}
