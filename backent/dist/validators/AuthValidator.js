"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
class AuthValidator {
    static validateLoginInput(payload) {
        if (!payload.email || !payload.password) {
            return { valid: false, message: "All fields required" };
        }
        return { valid: true };
    }
}
exports.AuthValidator = AuthValidator;
