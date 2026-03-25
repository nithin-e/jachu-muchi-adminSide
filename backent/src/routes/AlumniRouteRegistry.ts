import { Router } from "express";
import { AlumniController } from "../controllers/alumni.controller";
import { ICourseUploadMiddleware } from "../middlewares/interfaces/ICourseUploadMiddleware";

export class AlumniRouteRegistry {
  constructor(
    private readonly alumniController: AlumniController,
    private readonly alumniUploadMiddleware: ICourseUploadMiddleware
  ) {}

  register(router: Router): void {
    router.get(
      "/alumni/all",
      this.alumniController.listAll.bind(this.alumniController)
    );

    router.get(
      "/alumni/filter",
      this.alumniController.filterAlumni.bind(this.alumniController)
    );

    router.get(
      "/alumni",
      this.alumniController.list.bind(this.alumniController)
    );

    router.get(
      "/alumni/:id",
      this.alumniController.getById.bind(this.alumniController)
    );

    router.post(
      "/alumni",
      this.alumniUploadMiddleware.handle.bind(this.alumniUploadMiddleware),
      this.alumniController.create.bind(this.alumniController)
    );

    router.put(
      "/alumni/:id",
      this.alumniUploadMiddleware.handle.bind(this.alumniUploadMiddleware),
      this.alumniController.update.bind(this.alumniController)
    );

    router.delete(
      "/alumni/:id",
      this.alumniController.delete.bind(this.alumniController)
    );
  }
}
