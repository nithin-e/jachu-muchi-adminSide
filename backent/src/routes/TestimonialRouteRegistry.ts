import { Router } from "express";
import { TestimonialController } from "../controllers/testimonial.controller";
import { ICourseUploadMiddleware } from "../middlewares/interfaces/ICourseUploadMiddleware";

export class TestimonialRouteRegistry {
  constructor(
    private readonly testimonialController: TestimonialController,
    private readonly testimonialUploadMiddleware: ICourseUploadMiddleware
  ) {}

  register(router: Router): void {
    router.get(
      "/testimonials/all",
      this.testimonialController.listAll.bind(this.testimonialController)
    );

    router.get(
      "/testimonials",
      this.testimonialController.list.bind(this.testimonialController)
    );

    router.get(
      "/testimonials/filter",
      this.testimonialController.filterTestimonials.bind(
        this.testimonialController
      )
    );

    router.get(
      "/testimonials/:id",
      this.testimonialController.getById.bind(this.testimonialController)
    );

    router.post(
      "/testimonials",
      this.testimonialUploadMiddleware.handle.bind(
        this.testimonialUploadMiddleware
      ),
      this.testimonialController.create.bind(this.testimonialController)
    );

    router.put(
      "/testimonials/:id",
      this.testimonialUploadMiddleware.handle.bind(
        this.testimonialUploadMiddleware
      ),
      this.testimonialController.update.bind(this.testimonialController)
    );

    router.delete(
      "/testimonials/:id",
      this.testimonialController.delete.bind(this.testimonialController)
    );
  }
}
