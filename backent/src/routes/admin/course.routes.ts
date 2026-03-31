import { Router } from "express";
import {
  courseController,
  courseUploadMiddleware,
} from "../../config/injections/course.injection";

const router = Router();

router.get("/all", courseController.listAll.bind(courseController));
router.get("/filter", courseController.filterCourses.bind(courseController));
router.post(
  "/",
  courseUploadMiddleware.handle.bind(courseUploadMiddleware),
  courseController.create.bind(courseController)
);
router.patch(
  "/:id/image",
  courseUploadMiddleware.handle.bind(courseUploadMiddleware),
  courseController.uploadImage.bind(courseController)
);
router.put(
  "/:id",
  courseUploadMiddleware.handle.bind(courseUploadMiddleware),
  courseController.update.bind(courseController)
);
router.delete("/:id", courseController.delete.bind(courseController));

export default router;
