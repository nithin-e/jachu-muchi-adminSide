import { Router } from "express";
import {
  alumniController,
  alumniUploadMiddleware,
} from "../config/injections/alumni.injection";

const router = Router();

router.get("/all", alumniController.listAll.bind(alumniController));
router.get("/filter", alumniController.filterAlumni.bind(alumniController));
router.get("/", alumniController.list.bind(alumniController));
router.get("/:id", alumniController.getById.bind(alumniController));
router.post(
  "/",
  alumniUploadMiddleware.handle.bind(alumniUploadMiddleware),
  alumniController.create.bind(alumniController)
);
router.put(
  "/:id",
  alumniUploadMiddleware.handle.bind(alumniUploadMiddleware),
  alumniController.update.bind(alumniController)
);
router.delete("/:id", alumniController.delete.bind(alumniController));

export default router;
