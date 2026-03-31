export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
}

export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}

export interface LoginSuccessData {
  success: true;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginResultError {
  ok: false;
  status: number;
  message: string;
}

export interface LoginResultSuccess {
  ok: true;
  data: LoginSuccessData;
}

export type LoginResult = LoginResultError | LoginResultSuccess;
