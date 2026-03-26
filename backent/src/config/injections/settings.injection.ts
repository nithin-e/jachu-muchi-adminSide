import { SettingsController } from "../../controllers/settings.controller";
import { SettingsRepository } from "../../repositories/implementations/settings.repository";
import { UserManagementRepository } from "../../repositories/implementations/user-management.repository";
import { SettingsService } from "../../services/implementations/settings.service";

const settingsRepository = new SettingsRepository();
const userManagementRepository = new UserManagementRepository();
const settingsService = new SettingsService(
  settingsRepository,
  userManagementRepository
);

export const settingsController = new SettingsController(settingsService);
