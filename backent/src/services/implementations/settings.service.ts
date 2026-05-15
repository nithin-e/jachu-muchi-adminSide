import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ISettingsDocument } from "../../models/Settings";
import { INotificationEmailDocument } from "../../models/NotificationEmail";
import { ISettingsRepository } from "../../repositories/interfaces/ISettingsRepository";
import { INotificationEmailRepository } from "../../repositories/interfaces/INotificationEmailRepository";
import { IUserManagementRepository } from "../../repositories/interfaces/IUserManagementRepository";
import { SaveSettingsInput, UpdateAdminEmailInput, UpdateNotificationEmailsInput, UpdatePasswordInput } from "../../types/settings.types";
import {
  throwBadRequest,
  throwConflict,
  throwNotFound,
  throwUnauthorized,
} from "../../utils/http-errors.helper";
import { ISettingsService } from "../interfaces/ISettingsService";
import { MESSAGES } from "../../constants/messages";

const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class SettingsService implements ISettingsService {
  constructor(
    private readonly settingsRepository: ISettingsRepository,
    private readonly userManagementRepository: IUserManagementRepository,
    private readonly notificationEmailRepository: INotificationEmailRepository
  ) {}

  async getSettings(): Promise<ISettingsDocument> {
    let doc = await this.settingsRepository.getSingleton();
    if (!doc) {
      doc = await this.settingsRepository.upsertSingleton({
        adminEmail: "",
      });
    }
    const admins = await this.userManagementRepository.filter({
      page: 1,
      limit: 1,
    });
    if (admins.data.length > 0) {
      doc.adminEmail = admins.data[0].email;
    }
    return doc;
  }

  async saveSettings(input: SaveSettingsInput): Promise<ISettingsDocument> {
    const adminEmail = input.adminEmail?.trim() ?? "";

    if (adminEmail && !simpleEmail.test(adminEmail)) {
      throwBadRequest(
        MESSAGES.SETTINGS.INVALID_ADMIN_EMAIL_WHEN_PROVIDED
      );
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

    if (input.userId && adminEmail) {
      const user = await this.userManagementRepository.findById(input.userId);
      if (user) {
        const normalizedEmail = adminEmail.toLowerCase();
        const duplicate = await this.userManagementRepository.findByEmail(
          normalizedEmail,
          input.userId
        );
        if (duplicate) {
          throwBadRequest(MESSAGES.USER.DUPLICATE_EMAIL);
        }
        await this.userManagementRepository.updateById(input.userId, {
          name: user.name,
          email: normalizedEmail,
          role: user.role as "Admin" | "Sub Admin" | "Editor",
          status: user.status,
        });
      }
    }

    return this.settingsRepository.upsertSingleton({
      adminEmail,
    });
  }

  async addNotificationEmail(email: string): Promise<INotificationEmailDocument> {
    const trimmed = email.trim().toLowerCase();
    if (!simpleEmail.test(trimmed)) {
      throwBadRequest(MESSAGES.SETTINGS.INVALID_NOTIFICATION_EMAIL(trimmed));
    }
    const existing = await this.notificationEmailRepository.findByEmail(trimmed);
    if (existing) {
      throwConflict("This notification email already exists");
    }
    return this.notificationEmailRepository.create(trimmed);
  }

  async getNotificationEmails(): Promise<INotificationEmailDocument[]> {
    return this.notificationEmailRepository.findAll();
  }

  async deleteNotificationEmail(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throwBadRequest("Invalid notification email id");
    }
    const deleted = await this.notificationEmailRepository.deleteById(id);
    if (!deleted) {
      throwNotFound(MESSAGES.COMMON.NOT_FOUND("Notification email"));
    }
  }

  async updateAdminEmail(input: UpdateAdminEmailInput): Promise<ISettingsDocument> {
    const adminEmail = input.adminEmail.trim();
    if (!adminEmail) {
      throwBadRequest("Admin email is required");
    }
    if (!simpleEmail.test(adminEmail)) {
      throwBadRequest("Enter a valid admin email address");
    }
    if (!mongoose.Types.ObjectId.isValid(input.userId)) {
      throwBadRequest("Invalid user ID");
    }

    const user = await this.userManagementRepository.findById(input.userId);
    if (!user) {
      throwNotFound(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const normalizedEmail = adminEmail.toLowerCase();
    const duplicate = await this.userManagementRepository.findByEmail(normalizedEmail, input.userId);
    if (duplicate) {
      throwBadRequest(MESSAGES.USER.DUPLICATE_EMAIL);
    }

    await this.userManagementRepository.updateById(input.userId, {
      name: user.name,
      email: normalizedEmail,
      role: user.role as "Admin" | "Sub Admin" | "Editor",
      status: user.status,
    });

    return this.settingsRepository.upsertSingleton({ adminEmail });
  }

  async updateNotificationEmails(input: UpdateNotificationEmailsInput): Promise<void> {
    const validEmails = input.notificationEmails
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && simpleEmail.test(e));

    if (validEmails.length === 0) {
      throwBadRequest("At least 1 valid notification email is required");
    }

    const existing = await this.notificationEmailRepository.findAll();
    const existingEmails = new Set(existing.map((e) => e.email));

    const toDelete = existing.filter((e) => !validEmails.includes(e.email));
    const toAdd = validEmails.filter((e) => !existingEmails.has(e));

    for (const email of toDelete) {
      await this.notificationEmailRepository.deleteById(String(email._id));
    }

    for (const email of toAdd) {
      try {
        await this.notificationEmailRepository.create(email);
      } catch {
        // skip duplicates
      }
    }
  }

  async updatePassword(input: UpdatePasswordInput): Promise<void> {
    const { currentPassword, newPassword, userId } = input;

    if (!currentPassword || !newPassword) {
      throwBadRequest("Current password and new password are required");
    }

    if (newPassword.length < 8) {
      throwBadRequest("New password must be at least 8 characters");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throwBadRequest("Invalid user ID");
    }

    const user = await this.userManagementRepository.findById(userId);
    if (!user) {
      throwNotFound(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      throwUnauthorized("Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userManagementRepository.updatePasswordHashById(userId, passwordHash);
  }
}
