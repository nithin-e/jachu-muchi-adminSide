import bcrypt from "bcryptjs";
import { HttpStatusCode } from "axios";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ITokenService } from "../interfaces/ITokenService";
import { LoginRequest, LoginResult } from "../../types/auth.types";
import { MESSAGES } from "../../constants/messages";
import { ADMIN_USER_STATUS } from "../../models/User";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async login(payload: LoginRequest): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(payload.email);

    console.log("user will be here showen");
    console.log(user);
    console.log(payload.email);
    if (!user) {
      return {
        ok: false,
        status: HttpStatusCode.Unauthorized,
        message: MESSAGES.AUTH.USER_NOT_FOUND,
      };
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      return {
        ok: false,
        status: HttpStatusCode.Unauthorized,
        message: MESSAGES.AUTH.INVALID_PASSWORD,
      };
    }

    if (user.status === ADMIN_USER_STATUS.INACTIVE) {
      return {
        ok: false,
        status: HttpStatusCode.Forbidden,
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
