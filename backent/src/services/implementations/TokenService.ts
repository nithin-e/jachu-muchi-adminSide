import jwt from "jsonwebtoken";
import { ITokenService } from "../interfaces/ITokenService";
import { TokenPayload } from "../../types/auth.types";

export class TokenService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET is missing");
    }

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1m",
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET is missing");
    }

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "20m",
    });
  }
}
