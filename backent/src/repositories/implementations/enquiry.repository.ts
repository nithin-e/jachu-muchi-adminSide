import {
  EnquiryModel,
  ENQUIRY_TYPE_VALUES,
  EnquiryStatus,
  IEnquiryDocument,
} from "../../models/Enquiry";
import { IEnquiryRepository } from "../interfaces/IEnquiryRepository";

export class EnquiryRepository implements IEnquiryRepository {
  async findAll(): Promise<IEnquiryDocument[]> {
    return EnquiryModel.find()
      .sort({ createdAt: -1 })
      .lean();
  }

  async findById(enquiryId: string): Promise<IEnquiryDocument | null> {
    return EnquiryModel.findById(enquiryId);
  }

  async filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: EnquiryStatus;
    type?: (typeof ENQUIRY_TYPE_VALUES)[number];
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IEnquiryDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const {
      page,
      limit,
      search,
      status,
      type,
      sortBy,
      order = "desc",
    } = params;

    const skip = (page - 1) * limit;
    // Using `any` here because Mongo filter typing is strict and dynamic.
    // This query is still constructed safely from validated inputs in service/controller.
    const mongoQuery: any = {};

    if (status) mongoQuery.status = status;
    if (type) mongoQuery.type = type;

    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, "i");
      mongoQuery.$or = [
        { name: { $regex: regex } },
        { phone: { $regex: regex } },
        { email: { $regex: regex } },
        { message: { $regex: regex } },
      ];
    }

    const sortFieldCandidate = sortBy?.trim() || "createdAt";
    const sortField =
      EnquiryModel.schema.path(sortFieldCandidate) ||
      sortFieldCandidate === "createdAt"
        ? sortFieldCandidate
        : "createdAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const total = await EnquiryModel.countDocuments(mongoQuery);
    const pages = Math.ceil(total / limit);

    const data = await EnquiryModel.find(mongoQuery)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data, total, page, pages };
  }

  async updateStatusById(
    enquiryId: string,
    status: EnquiryStatus
  ): Promise<IEnquiryDocument | null> {
    return EnquiryModel.findByIdAndUpdate(
      enquiryId,
      { status },
      { new: true }
    );
  }

  async updateNotesById(
    enquiryId: string,
    notes: string
  ): Promise<IEnquiryDocument | null> {
    return EnquiryModel.findByIdAndUpdate(
      enquiryId,
      { notes },
      { new: true }
    );
  }

  async deleteById(enquiryId: string): Promise<IEnquiryDocument | null> {
    return EnquiryModel.findByIdAndDelete(enquiryId);
  }
}
