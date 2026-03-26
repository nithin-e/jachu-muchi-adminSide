import { CourseController } from "../../controllers/course.controller";
import { CourseUploadMiddleware } from "../../middlewares/implementations/CourseUploadMiddleware";
import { CourseRepository } from "../../repositories/implementations/course.repository";
import { CourseService } from "../../services/implementations/course.service";

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);

export const courseController = new CourseController(courseService);
export const courseUploadMiddleware = new CourseUploadMiddleware();
