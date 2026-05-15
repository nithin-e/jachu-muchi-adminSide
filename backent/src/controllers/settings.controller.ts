import { NextFunction, Request, Response } from "express";
import {
  mapBodyToSaveSettingsInput,
  toPublicSettings,
} from "../dto/settings.mapper";
import { ISettingsService } from "../services/interfaces/ISettingsService";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class SettingsController {
  constructor(private readonly settingsService: ISettingsService) {}

  async get(req: Request, res: Response, next: NextFunction){
    try {
      const doc = await this.settingsService.getSettings();
      const emails = await this.settingsService.getNotificationEmails();
      const data = toPublicSettings({
        adminEmail: doc.adminEmail,
      });

      return res.status(StatusCode.OK).json({
        success: true,
        data: {
          ...data,
          notificationEmails: emails.map((e) => ({ id: e._id, email: e.email })),
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async save(req: Request, res: Response, next: NextFunction){
    try {
      const payload = mapBodyToSaveSettingsInput(
        req.body as Record<string, unknown>
      );
      const user = (req as Request & { user?: { id: string } }).user;
      if (user) payload.userId = user.id;

      const doc = await this.settingsService.saveSettings(payload);

      const emails = await this.settingsService.getNotificationEmails();
      const data = toPublicSettings({
        adminEmail: doc.adminEmail,
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.SETTINGS.SAVED_SUCCESS,
        data: {
          ...data,
          notificationEmails: emails.map((e) => ({ id: e._id, email: e.email })),
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async addNotificationEmail(req: Request, res: Response, next: NextFunction){
    try {
      const { email } = req.body as { email?: string };
      if (!email) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Email is required",
        });
      }
      const doc = await this.settingsService.addNotificationEmail(email);
      return res.status(StatusCode.OK).json({
        success: true,
        data: { id: doc._id, email: doc.email },
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteNotificationEmail(req: Request, res: Response, next: NextFunction){
    try {
      const id = typeof req.params.id === "string" ? req.params.id : "";
      await this.settingsService.deleteNotificationEmail(id);
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Notification email deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateAdminEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as Request & { user?: { id: string } }).user;
      if (!user || !user.id) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { adminEmail } = req.body as { adminEmail?: string };
      if (!adminEmail || !adminEmail.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Admin email is required",
        });
      }
      if (!emailRegex.test(adminEmail.trim())) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Enter a valid email address",
        });
      }
      const doc = await this.settingsService.updateAdminEmail({ adminEmail: adminEmail.trim(), userId: user.id });
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Admin email updated",
        data: { adminEmail: doc.adminEmail },
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateNotificationEmails(req: Request, res: Response, next: NextFunction) {
    try {
      const { notificationEmails } = req.body as { notificationEmails?: string[] };
      if (!Array.isArray(notificationEmails)) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "notificationEmails must be an array",
        });
      }
      await this.settingsService.updateNotificationEmails({ notificationEmails });
      const emails = await this.settingsService.getNotificationEmails();
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Notification emails updated",
        data: { notificationEmails: emails.map((e) => ({ id: e._id, email: e.email })) },
      });
    } catch (error) {
      return next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as Request & { user?: { id: string } }).user;
      if (!user || !user.id) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
      if (!currentPassword || !newPassword) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Current password and new password are required",
        });
      }
      await this.settingsService.updatePassword({ currentPassword, newPassword, userId: user.id });
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Password updated",
      });
    } catch (error) {
      return next(error);
    }
  }
}
