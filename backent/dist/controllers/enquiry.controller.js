"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryController = void 0;
const statusCodes_1 = require("../constants/statusCodes");
const messages_1 = require("../constants/messages");
class EnquiryController {
    constructor(enquiryService) {
        this.enquiryService = enquiryService;
        /**
         * Initial-load endpoint: return all enquiry details (no pagination).
         * GET /api/enquiries
         */
        this.listAll = async (_req, res, next) => {
            try {
                const data = await this.enquiryService.getAllEnquiries();
                return res.status(statusCodes_1.StatusCode.OK).json({
                    success: true,
                    data,
                });
            }
            catch (error) {
                return next(error);
            }
        };
        this.updateStatus = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { status } = req.body;
                if (typeof id !== "string" || !id.trim()) {
                    return res.status(statusCodes_1.StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.MESSAGES.ENQUIRY.ID_REQUIRED,
                    });
                }
                if (typeof status !== "string" || !status.trim()) {
                    return res.status(statusCodes_1.StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.MESSAGES.ENQUIRY.STATUS_REQUIRED,
                    });
                }
                const updatedEnquiry = await this.enquiryService.updateEnquiryStatus(id, status);
                return res.status(statusCodes_1.StatusCode.OK).json({
                    success: true,
                    message: messages_1.MESSAGES.ENQUIRY.STATUS_UPDATED_SUCCESS,
                    data: updatedEnquiry,
                });
            }
            catch (error) {
                return next(error);
            }
        };
        /**
         * Filtering endpoint (search + pagination + sorting + filtering)
         * GET /api/enquiries/filter
         */
        this.filterEnquiries = async (req, res, next) => {
            try {
                const query = req.query;
                const pageRaw = query.page;
                const limitRaw = query.limit;
                const searchRaw = query.search;
                const statusRaw = query.status;
                const typeRaw = query.type;
                const sortByRaw = query.sortBy;
                const orderRaw = query.order;
                const page = typeof pageRaw === "string" && pageRaw.trim()
                    ? Number(pageRaw)
                    : 1;
                const limit = typeof limitRaw === "string" && limitRaw.trim()
                    ? Number(limitRaw)
                    : 10;
                const search = typeof searchRaw === "string" && searchRaw.trim()
                    ? searchRaw
                    : undefined;
                const status = typeof statusRaw === "string" && statusRaw.trim()
                    ? statusRaw
                    : undefined;
                const type = typeof typeRaw === "string" && typeRaw.trim()
                    ? typeRaw
                    : undefined;
                const sortBy = typeof sortByRaw === "string" && sortByRaw.trim()
                    ? sortByRaw
                    : undefined;
                const order = typeof orderRaw === "string" && orderRaw.trim()
                    ? (orderRaw === "asc" ? "asc" : "desc")
                    : "desc";
                const result = await this.enquiryService.filterEnquiries({
                    page,
                    limit,
                    search,
                    status: status,
                    type,
                    sortBy,
                    order,
                });
                return res.status(statusCodes_1.StatusCode.OK).json({
                    success: true,
                    data: result.data,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        pages: result.pages,
                    },
                });
            }
            catch (error) {
                return next(error);
            }
        };
        this.deleteEnquiry = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (typeof id !== "string" || !id.trim()) {
                    return res.status(statusCodes_1.StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.MESSAGES.ENQUIRY.ID_REQUIRED,
                    });
                }
                await this.enquiryService.deleteEnquiry(id);
                return res.status(statusCodes_1.StatusCode.OK).json({
                    success: true,
                    message: messages_1.MESSAGES.ENQUIRY.DELETED_SUCCESS,
                });
            }
            catch (error) {
                return next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (typeof id !== "string" || !id.trim()) {
                    return res.status(statusCodes_1.StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.MESSAGES.ENQUIRY.ID_REQUIRED,
                    });
                }
                const data = await this.enquiryService.getEnquiryById(id);
                return res.status(statusCodes_1.StatusCode.OK).json({
                    success: true,
                    data,
                });
            }
            catch (error) {
                return next(error);
            }
        };
        this.updateNotes = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (typeof id !== "string" || !id.trim()) {
                    return res.status(statusCodes_1.StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.MESSAGES.ENQUIRY.ID_REQUIRED,
                    });
                }
                const body = req.body;
                const notesRaw = body.notes ?? body.note;
                if (typeof notesRaw !== "string") {
                    return res.status(statusCodes_1.StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.MESSAGES.ENQUIRY.NOTES_REQUIRED,
                    });
                }
                const data = await this.enquiryService.updateEnquiryNotes(id, notesRaw);
                return res.status(statusCodes_1.StatusCode.OK).json({
                    success: true,
                    message: messages_1.MESSAGES.ENQUIRY.NOTES_UPDATED_SUCCESS,
                    data,
                });
            }
            catch (error) {
                return next(error);
            }
        };
    }
}
exports.EnquiryController = EnquiryController;
