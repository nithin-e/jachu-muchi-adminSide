import { Router } from "express";
import { courseController } from "../../config/injections/course.injection";

const router = Router();

// Public read-only endpoints
router.get("/all", courseController.listAll.bind(courseController));

export default router;
