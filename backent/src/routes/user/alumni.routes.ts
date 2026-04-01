import { Router } from "express";
import { alumniController } from "../../config/injections/alumni.injection";

const router = Router();

// Public read-only endpoints
router.get("/all", alumniController.listAll.bind(alumniController));

export default router;
