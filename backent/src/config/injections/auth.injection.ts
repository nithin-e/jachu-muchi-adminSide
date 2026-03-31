import { AuthController } from "../../controllers/auth.controller";
import { UserRepository } from "../../repositories/implementations/user.repository";
import { AuthService } from "../../services/implementations/auth.service";
import { TokenService } from "../../services/implementations/token.service";

const userRepository = new UserRepository();
const tokenService = new TokenService();
const authService = new AuthService(userRepository, tokenService);

export const authController = new AuthController(authService);
