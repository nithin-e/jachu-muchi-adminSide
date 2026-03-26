"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const messages_1 = require("../constants/messages");
const errorMiddleware = (error, req, res, _next) => {
    const status = error.status || 500;
    const message = error.message || messages_1.MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
    const response = {
        success: false,
        message,
        path: req.originalUrl,
        method: req.method,
    };
    if (process.env.NODE_ENV !== "production" && error.stack) {
        response.stack = error.stack;
    }
    res.status(status).json(response);
};
exports.errorMiddleware = errorMiddleware;
