"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const statusCodes_1 = require("../constants/statusCodes");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login({ email, password });
            if (!result.ok) {
                return res.status(result.status).json({
                    success: false,
                    message: result.message,
                });
            }
            return res.status(statusCodes_1.StatusCode.OK).json(result.data);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AuthController = AuthController;
