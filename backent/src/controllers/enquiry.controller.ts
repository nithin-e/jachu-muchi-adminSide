import { NextFunction, Request, Response } from "express";
import { getAllHandler } from "./getAllHandler";
import { EnquiryModel, EnquiryStatus, IEnquiryDocument } from "../models/Enquiry";
import { IEnquiryService } from "../services/interfaces/IEnquiryService";

export const getAllEnquiries = getAllHandler<IEnquiryDocument>(EnquiryModel, [
  "name",
  "phone",
  "course",
  "status",
]);

export class EnquiryController {
  constructor(private readonly enquiryService: IEnquiryService) {}

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status?: unknown };

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          success: false,
          message: "valid enquiry id is required",
        });
      }

      if (typeof status !== "string" || !status.trim()) {
        return res.status(400).json({
          success: false,
          message: "status is required",
        });
      }

      const updatedEnquiry = await this.enquiryService.updateEnquiryStatus(
        id,
        status as EnquiryStatus
      );

      return res.status(200).json({
        success: true,
        message: "Enquiry status updated successfully",
        data: updatedEnquiry,
      });
    } catch (error) {
      return next(error);
    }
  };
}
