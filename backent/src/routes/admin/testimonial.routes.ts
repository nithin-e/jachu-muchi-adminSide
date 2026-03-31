import { Router } from "express";
import {
  testimonialController,
  testimonialUploadMiddleware,
} from "../../config/injections/testimonial.injection";

const router = Router();

router.get("/all", testimonialController.listAll.bind(testimonialController));
router.get("/", testimonialController.list.bind(testimonialController));
router.get("/filter", testimonialController.filterTestimonials.bind(testimonialController));
router.get("/:id", testimonialController.getById.bind(testimonialController));
router.post(
  "/",
  testimonialUploadMiddleware.handle.bind(testimonialUploadMiddleware),
  testimonialController.create.bind(testimonialController)
);
router.put(
  "/:id",
  testimonialUploadMiddleware.handle.bind(testimonialUploadMiddleware),
  testimonialController.update.bind(testimonialController)
);
router.delete("/:id", testimonialController.delete.bind(testimonialController));

export default router;
