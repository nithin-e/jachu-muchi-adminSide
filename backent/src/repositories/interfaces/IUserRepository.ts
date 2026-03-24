import { AuthenticatedUser } from "../../types/auth.types";

export interface IUserRepository {
  findByEmail(email: string): Promise<AuthenticatedUser | null>;
}
