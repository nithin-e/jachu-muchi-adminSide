import { LoginRequest } from "../types/auth.types";
import { MESSAGES } from "../constants/messages";

export class AuthValidator {
  static validateLoginInput(payload: Partial<LoginRequest>): {
    valid: boolean;
    message?: string;
  } {
    if (!payload.email || !payload.password) {
      return { valid: false, message: MESSAGES.AUTH.ALL_FIELDS_REQUIRED };
    }

    return { valid: true };
  }
}
