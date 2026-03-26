import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../interfaces/ITokenService";
import { TokenPayload } from "../../types/auth.types";

export class TokenService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      throw new Error("ACCESS_TOKEN_SECRET is missing");
    }

    const accessTokenExpiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
      "15m") as SignOptions["expiresIn"];

    return jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenExpiresIn,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
      throw new Error("REFRESH_TOKEN_SECRET is missing");
    }

    const refreshTokenExpiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN ||
      "7d") as SignOptions["expiresIn"];

    return jwt.sign(payload, refreshTokenSecret, {
      expiresIn: refreshTokenExpiresIn,
    });
  }
}
