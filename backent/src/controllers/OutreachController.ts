import { Request, Response, NextFunction } from "express";
import { EnquiryPayload } from "../types/Outreachtypes";
import { IMailDispatchService } from "../services/interfaces/IMailDispatchService";


export class OutreachController {
  constructor(private readonly mailDispatchService: IMailDispatchService) {}

  handleEnquiry = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, phone, subject, message } =
        req.body as EnquiryPayload;

        console.log('.........brooooooooooooooooooooooooooooooooooooo..........');
        

      // ── Basic validation ──────────────────────────────────────────────
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        res.status(400).json({
          success: false,
          message: "name, email, and message are required fields.",
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid email address.",
        });
        return;
      }

      // ── Dispatch mails ────────────────────────────────────────────────
      const result = await this.mailDispatchService.dispatchEnquiryMails({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim(),
        subject: subject?.trim(),
        message: message.trim(),
      });

      const statusCode = result.success ? 200 : 500;

      res.status(statusCode).json({
        success: result.success,
        message: result.message,
        data: {
          deliveredTo: result.deliveredTo,
          failedTo: result.failedTo,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}