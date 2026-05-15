import { SettingsController } from "../../controllers/settings.controller";
import { SettingsRepository } from "../../repositories/implementations/settings.repository";
import { NotificationEmailRepository } from "../../repositories/implementations/notification-email.repository";
import { UserManagementRepository } from "../../repositories/implementations/user-management.repository";
import { SettingsService } from "../../services/implementations/settings.service";

const settingsRepository = new SettingsRepository();
const notificationEmailRepository = new NotificationEmailRepository();
const userManagementRepository = new UserManagementRepository();
const settingsService = new SettingsService(
  settingsRepository,
  userManagementRepository,
  notificationEmailRepository
);

export const settingsController = new SettingsController(settingsService);
