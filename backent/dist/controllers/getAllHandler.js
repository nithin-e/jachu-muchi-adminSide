"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHandler = void 0;
const buildQuery_1 = require("../utils/buildQuery");
const statusCodes_1 = require("../constants/statusCodes");
const getAllHandler = (model, searchFields, omitFields) => {
    return async (req, res, next) => {
        try {
            const result = await (0, buildQuery_1.buildQuery)(model, req.query, searchFields, omitFields);
            return res.status(statusCodes_1.StatusCode.OK).json({
                success: true,
                data: result.data,
                total: result.total,
                page: result.page,
                pages: result.pages,
            });
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.getAllHandler = getAllHandler;
