import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { ICourseUploadMiddleware } from "../middlewares/interfaces/ICourseUploadMiddleware";

/**
 * Registers course-related HTTP routes (HealNova-style: explicit registration class).
 */
export class CourseRouteRegistry {
  constructor(
    private readonly courseController: CourseController,
    private readonly courseUploadMiddleware: ICourseUploadMiddleware
  ) {}

  register(router: Router): void {
    router.get(
      "/courses/all",
      this.courseController.listAll.bind(this.courseController)
    );

    router.get(
      "/courses/filter",
      this.courseController.filterCourses.bind(this.courseController)
    );

    // Alias (optional) if UI uses `/products/*` instead of `/courses/*`
    router.get(
      "/products/filter",
      this.courseController.filterCourses.bind(this.courseController)
    );

    router.post(
      "/courses",
      this.courseUploadMiddleware.handle.bind(this.courseUploadMiddleware),
      this.courseController.create.bind(this.courseController)
    );

    router.patch(
      "/courses/:id/image",
      this.courseUploadMiddleware.handle.bind(this.courseUploadMiddleware),
      this.courseController.uploadImage.bind(this.courseController)
    );

    router.put(
      "/courses/:id",
      this.courseUploadMiddleware.handle.bind(this.courseUploadMiddleware),
      this.courseController.update.bind(this.courseController)
    );

    router.delete(
      "/courses/:id/image",
      this.courseController.deleteImage.bind(this.courseController)
    );

    router.delete(
      "/courses/:id",
      this.courseController.delete.bind(this.courseController)
    );
  }
}
