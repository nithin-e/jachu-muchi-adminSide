import { ISettingsDocument } from "../../models/Settings";
import { SaveSettingsInput } from "../../types/settings.types";

export interface ISettingsService {
  getSettings(): Promise<ISettingsDocument>;
  saveSettings(input: SaveSettingsInput): Promise<ISettingsDocument>;
}
