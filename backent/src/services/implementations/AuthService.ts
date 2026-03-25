import bcrypt from "bcryptjs";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ITokenService } from "../interfaces/ITokenService";
import { LoginRequest, LoginResult } from "../../types/auth.types";
import { MESSAGES } from "../../constants/messages";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async login(payload: LoginRequest): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(payload.email);
    console.log("User>>>>>>:", user);
    if (!user) {
      return { ok: false, status: 401, message: MESSAGES.AUTH.USER_NOT_FOUND };
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      return {
        ok: false,
        status: 401,
        message: MESSAGES.AUTH.INVALID_PASSWORD,
      };
    }

    if (user.status === "Inactive") {
      return {
        ok: false,
        status: 403,
        message: MESSAGES.AUTH.ACCOUNT_INACTIVE,
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
