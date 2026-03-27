"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryController = void 0;
const statusCodes_1 = require("../constants/statusCodes");
const messages_1 = require("../constants/messages");
class EnquiryController {
    constructor(enquiryService) {
        this.enquiryService = enquiryService;
    }
    parseFilterQuery(query) {
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
        const search = typeof searchRaw === "string" ? searchRaw : undefined;
        const status = typeof statusRaw === "string" && statusRaw.trim()
            ? statusRaw.trim()
            : undefined;
        const type = typeof typeRaw === "string" && typeRaw.trim() ? typeRaw.trim() : undefined;
        const sortBy = typeof sortByRaw === "string" && sortByRaw.trim()
            ? sortByRaw.trim()
            : "date";
        const order = typeof orderRaw === "string" && orderRaw.trim()
            ? orderRaw.trim()
            : undefined;
        return { page, limit, search, status, type, sortBy, order };
    }
    mapListResponseData(input) {
        return input.map((doc) => {
            const { createdAt, updatedAt, course, notes, __v, ...rest } = doc;
            return {
                ...rest,
                date: createdAt,
            };
        });
    }
    /**
     * Initial-load endpoint: return all enquiry details (no pagination).
     * GET /api/enquiries
     */
    async listAll(req, res, next) {
        try {
            const params = this.parseFilterQuery(req.query);
            const result = await this.enquiryService.filterEnquiries(params);
            return res.status(statusCodes_1.StatusCode.OK).json({
                success: true,
                total: result.total,
                page: result.page,
                limit: params.limit,
                data: this.mapListResponseData(result.data),
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async updateStatus(req, res, next) {
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
    }
    /**
     * Filtering endpoint (search + pagination + sorting + filtering)
     * GET /api/enquiries/filter
     */
    async filterEnquiries(req, res, next) {
        try {
            const params = this.parseFilterQuery(req.query);
            const result = await this.enquiryService.filterEnquiries(params);
            return res.status(statusCodes_1.StatusCode.OK).json({
                success: true,
                total: result.total,
                page: result.page,
                limit: params.limit,
                data: this.mapListResponseData(result.data),
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async deleteEnquiry(req, res, next) {
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
    }
    async getById(req, res, next) {
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
    }
    async updateNotes(req, res, next) {
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
    }
}
exports.EnquiryController = EnquiryController;
