import { TestimonialController } from "../../controllers/testimonial.controller";
import { TestimonialUploadMiddleware } from "../../middlewares/implementations/TestimonialUploadMiddleware";
import { TestimonialRepository } from "../../repositories/implementations/testimonial.repository";
import { TestimonialService } from "../../services/implementations/testimonial.service";

const testimonialRepository = new TestimonialRepository();
const testimonialService = new TestimonialService(testimonialRepository);

export const testimonialController = new TestimonialController(
  testimonialService
);
export const testimonialUploadMiddleware = new TestimonialUploadMiddleware();
