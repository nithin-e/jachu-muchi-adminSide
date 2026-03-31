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
      const { fullName, emailOrPhone, course, message } =
        req.body as EnquiryPayload;

      console.log(
        "[OutreachController] Incoming enquiry:",
        { fullName, emailOrPhone, course, message }
      );

      // ── Basic presence validation ────────────────────────────────────
      if (!fullName?.trim() || !emailOrPhone?.trim() || !message?.trim()) {
        res.status(400).json({
          success: false,
          message: "fullName, emailOrPhone, and message are required fields.",
        });
        return;
      }

      // ── Email / phone format validation ──────────────────────────────
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10,15}$/;
      const isValidEmail = emailRegex.test(emailOrPhone.trim());
      const isValidPhone = phoneRegex.test(emailOrPhone.trim().replace(/\D/g, ""));

      if (!isValidEmail && !isValidPhone) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid email address or phone number.",
        });
        return;
      }

      const payload: EnquiryPayload = {
        fullName:     fullName.trim(),
        emailOrPhone: emailOrPhone.trim(),
        course:       course?.trim() || "",
        message:      message.trim(),
      };

      // ── Respond immediately — don't make the user wait for emails ────
      res.status(200).json({
        success: true,
        message: "Enquiry received. Our admissions team will contact you shortly.",
      });

      console.log("[OutreachController] Response sent. Dispatching mails in background...");

      // ── Fire-and-forget mail dispatch ────────────────────────────────
      this.mailDispatchService
        .dispatchEnquiryMails(payload)
        .then((result) => {
          console.log("[OutreachController] Mail dispatch complete:", {
            success:     result.success,
            deliveredTo: result.deliveredTo,
            failedTo:    result.failedTo,
          });
        })
        .catch((err) => {
          console.error("[OutreachController] Background mail dispatch failed:", err);
        });

    } catch (error) {
      next(error);
    }
  };
}