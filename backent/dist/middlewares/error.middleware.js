"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const messages_1 = require("../constants/messages");
const errorMiddleware = (error, _req, res, _next) => {
    const status = error.status || 500;
    const message = error.message || messages_1.MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
    res.status(status).json({ message });
};
exports.errorMiddleware = errorMiddleware;
