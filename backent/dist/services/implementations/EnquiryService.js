"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Enquiry_1 = require("../../models/Enquiry");
class EnquiryService {
    constructor(enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }
    async updateEnquiryStatus(enquiryId, status) {
        if (!mongoose_1.default.Types.ObjectId.isValid(enquiryId)) {
            const error = new Error("Invalid enquiry id");
            error.status = 400;
            throw error;
        }
        if (!Enquiry_1.ENQUIRY_STATUS_VALUES.includes(status)) {
            const error = new Error("Invalid status value");
            error.status = 400;
            throw error;
        }
        const updated = await this.enquiryRepository.updateStatusById(enquiryId, status);
        if (!updated) {
            const error = new Error("Enquiry not found");
            error.status = 404;
            throw error;
        }
        return updated;
    }
}
exports.EnquiryService = EnquiryService;
