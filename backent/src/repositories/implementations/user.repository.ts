import { IUserRepository } from "../interfaces/IUserRepository";
import { AuthenticatedUser } from "../../types/auth.types";
import { UserModel } from "../../models/User";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<AuthenticatedUser | null> {
    
    const normalizedEmail = email.trim().toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail })

   
    if (!user) {
      console.log("user not found.......");
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      role: user.role,
      status: (user as { status?: string }).status,
    };
  }
}
