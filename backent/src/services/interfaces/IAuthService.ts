import { LoginRequest, LoginResult } from "../../types/auth.types";

export interface IAuthService {
  login(payload: LoginRequest): Promise<LoginResult>;
}
