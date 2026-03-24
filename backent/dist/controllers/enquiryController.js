"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEnquiries = exports.EnquiryController = void 0;
class EnquiryController {
    constructor(enquiryService) {
        this.enquiryService = enquiryService;
        this.updateStatus = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { status } = req.body;
                if (!status) {
                    return res.status(400).json({
                        success: false,
                        message: "status is required",
                    });
                }
                const updatedEnquiry = await this.enquiryService.updateEnquiryStatus(id, status);
                return res.status(200).json({
                    success: true,
                    message: "Enquiry status updated successfully",
                    data: updatedEnquiry,
                });
            }
            catch (error) {
                return next(error);
            }
        };
    }
}
exports.EnquiryController = EnquiryController;
const getAllHandler_1 = require("./getAllHandler");
const Enquiry_1 = require("../models/Enquiry");
exports.getAllEnquiries = (0, getAllHandler_1.getAllHandler)(Enquiry_1.EnquiryModel, [
    "name",
    "phone",
    "course",
    "status",
]);
