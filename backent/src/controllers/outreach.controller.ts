import { Request, Response, NextFunction } from "express";
import { EnquiryPayload } from "../types/Outreachtypes";
import { IMailDispatchService } from "../services/interfaces/IMailDispatchService";
import { IEnquiryRepository } from "../repositories/interfaces/IEnquiryRepository";

export class OutreachController {
  constructor(
    private readonly mailDispatchService: IMailDispatchService,
    private readonly enquiryRepository: IEnquiryRepository
  ) {}

  handleEnquiry = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { fullName, email, phone, course, subject, type, message } =
        req.body as EnquiryPayload;

      console.log(
        "[OutreachController] Incoming enquiry:",
        { fullName, email, phone, course, subject, type, message }
      );

      // ── Basic presence validation ────────────────────────────────────
      if (
        !fullName?.trim() ||
        !email?.trim() ||
        !phone?.trim() ||
        !message?.trim()
      ) {
        res.status(400).json({
          success: false,
          message: "fullName, email, phone, and message are required fields.",
        });
        return;
      }

      // ── Email format validation ──────────────────────────────────────
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid email address.",
        });
        return;
      }

      // ── Phone format validation (allow international format with +) ──
      const normalizedPhone = phone.trim().replace(/[\s().-]/g, "");
      const phoneRegex = /^\+?\d{7,15}$/;
      if (!phoneRegex.test(normalizedPhone)) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid phone number (e.g. +919876543210).",
        });
        return;
      }

      const subjectOrCourse = course?.trim() || subject?.trim() || "N/A";
      const rawType = typeof type === "string" ? type.trim() : "";
      const normalizedType: "course_enquiry" | "general" =
        rawType === "course_enquiry" || rawType === "general"
          ? rawType
          : course?.trim()
            ? "course_enquiry"
            : "general";

      const enquiryPayload = {
        name: fullName.trim(),
        phone: normalizedPhone,
        email: email.trim().toLowerCase(),
        course: subjectOrCourse,
        message: message.trim(),
        type: normalizedType,
      };

      // ── Save enquiry to database ─────────────────────────────────────
      const savedEnquiry = await this.enquiryRepository.create(enquiryPayload);

      console.log(
        "[OutreachController] Enquiry saved to DB:",
        savedEnquiry._id
      );

      const mailPayload: EnquiryPayload = {
        fullName: enquiryPayload.name,
        email: enquiryPayload.email,
        phone: enquiryPayload.phone,
        course: enquiryPayload.course,
        subject: subjectOrCourse,
        type: enquiryPayload.type,
        message: enquiryPayload.message,
      };

      // ── Respond immediately — don't make the user wait for emails ────
      res.status(200).json({
        success: true,
        message: "Enquiry received. Our admissions team will contact you shortly.",
      });

      console.log("[OutreachController] Response sent. Dispatching mails in background...");

      // ── Fire-and-forget mail dispatch ────────────────────────────────
      this.mailDispatchService
        .dispatchEnquiryMails(mailPayload)
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