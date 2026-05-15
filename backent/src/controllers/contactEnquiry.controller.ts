import { Request, Response, NextFunction } from "express";
import { IContactEnquiryService } from "../services/interfaces/IContactEnquiryService";
import { StatusCode } from "../constants/statusCodes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ContactEnquiryController {
  constructor(
    private readonly contactEnquiryService: IContactEnquiryService
  ) {}

  sendEnquiry = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const { fullName, email, phone, subject, message } = req.body;

      if (
        !fullName?.trim() ||
        !email?.trim() ||
        !phone?.trim() ||
        !message?.trim()
      ) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Validation failed",
        });
        return;
      }

      if (!EMAIL_REGEX.test(email.trim())) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Validation failed",
        });
        return;
      }

      await this.contactEnquiryService.sendEnquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject?.trim() || "General Enquiry",
        message: message.trim(),
      });

      res.status(StatusCode.OK).json({
        success: true,
        message: "Enquiry sent successfully",
      });
    } catch (error) {
      console.error("[ContactEnquiryController] Failed to send enquiry:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to send enquiry",
      });
    }
  };
}
