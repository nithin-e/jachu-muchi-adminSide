import { AuthController } from "../controllers/AuthController";
import { EnquiryController } from "../controllers/enquiry.controller";
import { EnquiryRepository } from "../repositories/implementations/EnquiryRepository";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { AuthService } from "../services/implementations/AuthService";
import { EnquiryService } from "../services/implementations/EnquiryService";
import { TokenService } from "../services/implementations/TokenService";

const userRepository = new UserRepository();
const tokenService = new TokenService();
const authService = new AuthService(userRepository, tokenService);
const enquiryRepository = new EnquiryRepository();
const enquiryService = new EnquiryService(enquiryRepository);

export const authController = new AuthController(authService);
export const enquiryController = new EnquiryController(enquiryService);
