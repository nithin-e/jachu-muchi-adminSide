"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
const messages_1 = require("../constants/messages");
class AuthValidator {
    static validateLoginInput(payload) {
        if (!payload.email || !payload.password) {
            return { valid: false, message: messages_1.MESSAGES.AUTH.ALL_FIELDS_REQUIRED };
        }
        return { valid: true };
    }
}
exports.AuthValidator = AuthValidator;
