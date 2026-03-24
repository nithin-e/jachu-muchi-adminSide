"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthValidator_1 = require("../validators/AuthValidator");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.login = async (req, res, next) => {
            try {
                console.log(`broooooooooooooo.......... pid=${process.pid}`);
                const { email, password } = req.body;
                const validation = AuthValidator_1.AuthValidator.validateLoginInput({ email, password });
                if (!validation.valid) {
                    return res.status(400).json({ message: validation.message });
                }
                const result = await this.authService.login({ email, password });
                if (!result.ok) {
                    return res.status(result.status).json({ message: result.message });
                }
                return res.json(result.data);
            }
            catch (error) {
                return next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
