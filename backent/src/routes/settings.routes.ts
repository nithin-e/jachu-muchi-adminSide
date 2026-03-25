import { Router } from "express";
import { settingsController } from "../config/dependency-injection";

const router = Router();

router.get("/settings", settingsController.get.bind(settingsController));
router.put("/settings", settingsController.save.bind(settingsController));

export default router;
