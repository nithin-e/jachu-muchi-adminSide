"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Enquiry_1 = require("../../models/Enquiry");
const httpErrors_1 = require("../../utils/httpErrors");
const messages_1 = require("../../constants/messages");
class EnquiryService {
    constructor(enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }
    async getAllEnquiries() {
        return this.enquiryRepository.findAll();
    }
    async filterEnquiries(params) {
        const { page, limit, search, status, type, sortBy, order } = params;
        if (!Number.isFinite(page) || page < 1) {
            (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.COMMON.PAGE_POSITIVE);
        }
        if (!Number.isFinite(limit) || limit < 1) {
            (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.COMMON.LIMIT_POSITIVE);
        }
        if (status && !Enquiry_1.ENQUIRY_STATUS_VALUES.includes(status)) {
            (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.ENQUIRY.INVALID_STATUS_VALUE);
        }
        let normalizedType;
        if (type !== undefined) {
            if (typeof type !== "string" || !type.trim()) {
                (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.ENQUIRY.TYPE_MUST_BE_VALID_ENQUIRY_TYPE);
            }
            if (!Enquiry_1.ENQUIRY_TYPE_VALUES.includes(type)) {
                (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.ENQUIRY.INVALID_TYPE_VALUE);
            }
            normalizedType = type;
        }
        // Extra guard against unexpected sort fields
        const safeSortBy = typeof sortBy === "string" && sortBy.trim() ? sortBy.trim() : undefined;
        return this.enquiryRepository.filter({
            page,
            limit,
            search,
            status,
            type: normalizedType,
            sortBy: safeSortBy ?? "createdAt",
            order: order ?? "desc",
        });
    }
    async updateEnquiryStatus(enquiryId, status) {
        if (!mongoose_1.default.Types.ObjectId.isValid(enquiryId)) {
            (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.ENQUIRY.INVALID_ID);
        }
        if (!Enquiry_1.ENQUIRY_STATUS_VALUES.includes(status)) {
            (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.ENQUIRY.INVALID_STATUS_VALUE);
        }
        const updated = await this.enquiryRepository.updateStatusById(enquiryId, status);
        if (!updated) {
            (0, httpErrors_1.throwNotFound)(messages_1.MESSAGES.ENQUIRY.NOT_FOUND);
        }
        return updated;
    }
    async getEnquiryById(enquiryId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(enquiryId)) {
            (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.ENQUIRY.INVALID_ID);
        }
        const doc = await this.enquiryRepository.findById(enquiryId);
        if (!doc) {
            (0, httpErrors_1.throwNotFound)(messages_1.MESSAGES.ENQUIRY.NOT_FOUND);
        }
        return doc;
    }
    async updateEnquiryNotes(enquiryId, notes) {
        if (!mongoose_1.default.Types.ObjectId.isValid(enquiryId)) {
            (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.ENQUIRY.INVALID_ID);
        }
        const trimmed = notes?.trim() ?? "";
        const updated = await this.enquiryRepository.updateNotesById(enquiryId, trimmed);
        if (!updated) {
            (0, httpErrors_1.throwNotFound)(messages_1.MESSAGES.ENQUIRY.NOT_FOUND);
        }
        return updated;
    }
    async deleteEnquiry(enquiryId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(enquiryId)) {
            (0, httpErrors_1.throwBadRequest)(messages_1.MESSAGES.ENQUIRY.INVALID_ID);
        }
        const removed = await this.enquiryRepository.deleteById(enquiryId);
        if (!removed) {
            (0, httpErrors_1.throwNotFound)(messages_1.MESSAGES.ENQUIRY.NOT_FOUND);
        }
    }
}
exports.EnquiryService = EnquiryService;
