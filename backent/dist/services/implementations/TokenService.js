"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    generateAccessToken(payload) {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessTokenSecret) {
            throw new Error("ACCESS_TOKEN_SECRET is missing");
        }
        const accessTokenExpiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
            "15m");
        return jsonwebtoken_1.default.sign(payload, accessTokenSecret, {
            expiresIn: accessTokenExpiresIn,
        });
    }
    generateRefreshToken(payload) {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
            throw new Error("REFRESH_TOKEN_SECRET is missing");
        }
        const refreshTokenExpiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN ||
            "7d");
        return jsonwebtoken_1.default.sign(payload, refreshTokenSecret, {
            expiresIn: refreshTokenExpiresIn,
        });
    }
}
exports.TokenService = TokenService;
