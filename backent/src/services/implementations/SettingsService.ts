import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ISettingsDocument } from "../../models/Settings";
import { ISettingsRepository } from "../../repositories/interfaces/ISettingsRepository";
import { IUserManagementRepository } from "../../repositories/interfaces/IUserManagementRepository";
import { SaveSettingsInput } from "../../types/settings.types";
import {
  throwBadRequest,
  throwNotFound,
  throwUnauthorized,
} from "../../utils/httpErrors";
import { ISettingsService } from "../interfaces/ISettingsService";
import { MESSAGES } from "../../constants/messages";

const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class SettingsService implements ISettingsService {
  constructor(
    private readonly settingsRepository: ISettingsRepository,
    private readonly userManagementRepository: IUserManagementRepository
  ) {}

  async getSettings(): Promise<ISettingsDocument> {
    let doc = await this.settingsRepository.getSingleton();
    if (!doc) {
      doc = await this.settingsRepository.upsertSingleton({
        whatsAppNumber: "",
        adminEmail: "",
        notificationEmails: [],
      });
    }
    return doc;
  }

  async saveSettings(input: SaveSettingsInput): Promise<ISettingsDocument> {
    const whatsAppNumber = input.whatsAppNumber?.trim() ?? "";
    const adminEmail = input.adminEmail?.trim() ?? "";
    const notificationEmails = (input.notificationEmails ?? [])
      .map((e) => e.trim())
      .filter(Boolean);

    if (adminEmail && !simpleEmail.test(adminEmail)) {
      throwBadRequest(
        MESSAGES.SETTINGS.INVALID_ADMIN_EMAIL_WHEN_PROVIDED
      );
    }

    for (const e of notificationEmails) {
      if (!simpleEmail.test(e)) {
        throwBadRequest(MESSAGES.SETTINGS.INVALID_NOTIFICATION_EMAIL(e));
      }
    }

    const hasPwd =
      input.currentPassword !== undefined ||
      input.newPassword !== undefined ||
      input.confirmNewPassword !== undefined;

    if (hasPwd) {
      if (
        !input.userId ||
        !input.currentPassword ||
        !input.newPassword ||
        input.confirmNewPassword === undefined
      ) {
        throwBadRequest(
          MESSAGES.SETTINGS.PASSWORD_CHANGE_REQUIRES_ALL
        );
      }

      if (!mongoose.Types.ObjectId.isValid(input.userId)) {
        throwBadRequest(MESSAGES.SETTINGS.INVALID_USER_ID);
      }

      if (input.newPassword.length < 6) {
        throwBadRequest(MESSAGES.SETTINGS.NEW_PASSWORD_MIN_6);
      }

      if (input.newPassword !== input.confirmNewPassword) {
        throwBadRequest(MESSAGES.SETTINGS.PASSWORDS_DO_NOT_MATCH);
      }

      const user = await this.userManagementRepository.findById(input.userId);
      if (!user) {
        throwNotFound(MESSAGES.AUTH.USER_NOT_FOUND);
      }

      const ok = await bcrypt.compare(
        input.currentPassword,
        user.password
      );
      if (!ok) {
        throwUnauthorized(MESSAGES.SETTINGS.CURRENT_PASSWORD_INCORRECT);
      }

      const passwordHash = await bcrypt.hash(input.newPassword, 10);
      const updatedUser =
        await this.userManagementRepository.updatePasswordHashById(
          input.userId,
          passwordHash
        );
      if (!updatedUser) {
        throwNotFound(MESSAGES.AUTH.USER_NOT_FOUND);
      }
    }

    return this.settingsRepository.upsertSingleton({
      whatsAppNumber,
      adminEmail,
      notificationEmails,
    });
  }
}
