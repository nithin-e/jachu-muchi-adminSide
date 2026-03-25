"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const messages_1 = require("../../constants/messages");
class AuthService {
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    async login(payload) {
        const user = await this.userRepository.findByEmail(payload.email);
        console.log("User>>>>>>:", user);
        if (!user) {
            return { ok: false, status: 401, message: messages_1.MESSAGES.AUTH.USER_NOT_FOUND };
        }
        const isMatch = await bcryptjs_1.default.compare(payload.password, user.password);
        if (!isMatch) {
            return {
                ok: false,
                status: 401,
                message: messages_1.MESSAGES.AUTH.INVALID_PASSWORD,
            };
        }
        if (user.status === "Inactive") {
            return {
                ok: false,
                status: 403,
                message: messages_1.MESSAGES.AUTH.ACCOUNT_INACTIVE,
            };
        }
        const accessToken = this.tokenService.generateAccessToken({
            id: user.id,
            email: user.email,
        });
        const refreshToken = this.tokenService.generateRefreshToken({
            id: user.id,
        });
        return {
            ok: true,
            data: {
                success: true,
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                },
            },
        };
    }
}
exports.AuthService = AuthService;
