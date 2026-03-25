import { NextFunction, Request, Response } from "express";
import {
  mapBodyToSaveSettingsInput,
  toPublicSettings,
} from "../dto/settings.mapper";
import { ISettingsService } from "../services/interfaces/ISettingsService";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export class SettingsController {
  constructor(private readonly settingsService: ISettingsService) {}

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await this.settingsService.getSettings();
      const data = toPublicSettings({
        whatsAppNumber: doc.whatsAppNumber,
        adminEmail: doc.adminEmail,
        notificationEmails: doc.notificationEmails ?? [],
      });

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  };

  save = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = mapBodyToSaveSettingsInput(
        req.body as Record<string, unknown>
      );
      const doc = await this.settingsService.saveSettings(payload);

      const data = toPublicSettings({
        whatsAppNumber: doc.whatsAppNumber,
        adminEmail: doc.adminEmail,
        notificationEmails: doc.notificationEmails ?? [],
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.SETTINGS.SAVED_SUCCESS,
        data,
      });
    } catch (error) {
      return next(error);
    }
  };
}
