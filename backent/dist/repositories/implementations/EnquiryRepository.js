"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryRepository = void 0;
const Enquiry_1 = require("../../models/Enquiry");
class EnquiryRepository {
    async findAll() {
        return Enquiry_1.EnquiryModel.find()
            .sort({ createdAt: -1 })
            .lean();
    }
    async findById(enquiryId) {
        return Enquiry_1.EnquiryModel.findById(enquiryId);
    }
    async filter(params) {
        const { page, limit, search, status, type, sortBy, order = "desc", } = params;
        const skip = (page - 1) * limit;
        // Using `any` here because Mongo filter typing is strict and dynamic.
        // This query is still constructed safely from validated inputs in service/controller.
        const mongoQuery = {};
        if (status)
            mongoQuery.status = status;
        if (type)
            mongoQuery.type = type;
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
        const sortField = Enquiry_1.EnquiryModel.schema.path(sortFieldCandidate) ||
            sortFieldCandidate === "createdAt"
            ? sortFieldCandidate
            : "createdAt";
        const sortDirection = order === "asc" ? 1 : -1;
        const total = await Enquiry_1.EnquiryModel.countDocuments(mongoQuery);
        const pages = Math.ceil(total / limit);
        const data = await Enquiry_1.EnquiryModel.find(mongoQuery)
            .sort({ [sortField]: sortDirection })
            .skip(skip)
            .limit(limit)
            .lean();
        return { data, total, page, pages };
    }
    async updateStatusById(enquiryId, status) {
        return Enquiry_1.EnquiryModel.findByIdAndUpdate(enquiryId, { status }, { new: true });
    }
    async updateNotesById(enquiryId, notes) {
        return Enquiry_1.EnquiryModel.findByIdAndUpdate(enquiryId, { notes }, { new: true });
    }
    async deleteById(enquiryId) {
        return Enquiry_1.EnquiryModel.findByIdAndDelete(enquiryId);
    }
}
exports.EnquiryRepository = EnquiryRepository;
