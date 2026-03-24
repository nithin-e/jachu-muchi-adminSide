"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (error, _req, res, _next) => {
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({ message });
};
exports.errorMiddleware = errorMiddleware;
