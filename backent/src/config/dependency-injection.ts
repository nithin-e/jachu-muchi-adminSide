import { ArticleController } from "../controllers/article.controller";
import { AuthController } from "../controllers/AuthController";
import { CategoryController } from "../controllers/category.controller";
import { CourseController } from "../controllers/course.controller";
import { EnquiryController } from "../controllers/enquiry.controller";
import { AlumniController } from "../controllers/alumni.controller";
import { BannerController } from "../controllers/banner.controller";
import { BranchController } from "../controllers/branch.controller";
import { UserManagementController } from "../controllers/userManagement.controller";
import { TestimonialController } from "../controllers/testimonial.controller";
import { SettingsController } from "../controllers/settings.controller";
import { AlumniUploadMiddleware } from "../middlewares/implementations/AlumniUploadMiddleware";
import { ArticleUploadMiddleware } from "../middlewares/implementations/ArticleUploadMiddleware";
import { BannerUploadMiddleware } from "../middlewares/implementations/BannerUploadMiddleware";
import { CourseUploadMiddleware } from "../middlewares/implementations/CourseUploadMiddleware";
import { TestimonialUploadMiddleware } from "../middlewares/implementations/TestimonialUploadMiddleware";
import { ArticleRepository } from "../repositories/implementations/ArticleRepository";
import { CategoryRepository } from "../repositories/implementations/CategoryRepository";
import { CourseRepository } from "../repositories/implementations/CourseRepository";
import { EnquiryRepository } from "../repositories/implementations/EnquiryRepository";
import { AlumniRepository } from "../repositories/implementations/AlumniRepository";
import { BannerRepository } from "../repositories/implementations/BannerRepository";
import { BranchRepository } from "../repositories/implementations/BranchRepository";
import { TestimonialRepository } from "../repositories/implementations/TestimonialRepository";
import { UserManagementRepository } from "../repositories/implementations/UserManagementRepository";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { SettingsRepository } from "../repositories/implementations/SettingsRepository";
import { ArticleService } from "../services/implementations/ArticleService";
import { AuthService } from "../services/implementations/AuthService";
import { CategoryService } from "../services/implementations/CategoryService";
import { CourseService } from "../services/implementations/CourseService";
import { EnquiryService } from "../services/implementations/EnquiryService";
import { AlumniService } from "../services/implementations/AlumniService";
import { BannerService } from "../services/implementations/BannerService";
import { UserManagementService } from "../services/implementations/UserManagementService";
import { BranchService } from "../services/implementations/BranchService";
import { TestimonialService } from "../services/implementations/TestimonialService";
import { SettingsService } from "../services/implementations/SettingsService";
import { TokenService } from "../services/implementations/TokenService";

const userRepository = new UserRepository();
const userManagementRepository = new UserManagementRepository();
const userManagementService = new UserManagementService(
  userManagementRepository
);
const tokenService = new TokenService();
const authService = new AuthService(userRepository, tokenService);
const enquiryRepository = new EnquiryRepository();
const enquiryService = new EnquiryService(enquiryRepository);
const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
export const courseUploadMiddleware = new CourseUploadMiddleware();

const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);
export const articleUploadMiddleware = new ArticleUploadMiddleware();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

const testimonialRepository = new TestimonialRepository();
const testimonialService = new TestimonialService(testimonialRepository);
export const testimonialUploadMiddleware = new TestimonialUploadMiddleware();

const alumniRepository = new AlumniRepository();
const alumniService = new AlumniService(alumniRepository);
export const alumniUploadMiddleware = new AlumniUploadMiddleware();

const branchRepository = new BranchRepository();
const branchService = new BranchService(branchRepository);

const bannerRepository = new BannerRepository();
const bannerService = new BannerService(bannerRepository);
export const bannerUploadMiddleware = new BannerUploadMiddleware();

const settingsRepository = new SettingsRepository();
const settingsService = new SettingsService(
  settingsRepository,
  userManagementRepository
);

export const authController = new AuthController(authService);
export const userManagementController = new UserManagementController(
  userManagementService
);
export const enquiryController = new EnquiryController(enquiryService);
export const courseController = new CourseController(courseService);
export const articleController = new ArticleController(articleService);
export const categoryController = new CategoryController(categoryService);
export const testimonialController = new TestimonialController(
  testimonialService
);
export const alumniController = new AlumniController(alumniService);
export const branchController = new BranchController(branchService);
export const bannerController = new BannerController(bannerService);
export const settingsController = new SettingsController(settingsService);
