import { LoginRequest } from "../types/auth.types";

export class AuthValidator {
  static validateLoginInput(payload: Partial<LoginRequest>): {
    valid: boolean;
    message?: string;
  } {
    if (!payload.email || !payload.password) {
      return { valid: false, message: "All fields required" };
    }

    return { valid: true };
  }
}
