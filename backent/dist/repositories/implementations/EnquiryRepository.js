"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryRepository = void 0;
const Enquiry_1 = require("../../models/Enquiry");
class EnquiryRepository {
    async updateStatusById(enquiryId, status) {
        return Enquiry_1.EnquiryModel.findByIdAndUpdate(enquiryId, { status }, { new: true });
    }
}
exports.EnquiryRepository = EnquiryRepository;
