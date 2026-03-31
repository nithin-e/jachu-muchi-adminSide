import { Router } from "express";
import { settingsController } from "../../config/injections/settings.injection";

const router = Router();

router.get("/", settingsController.get.bind(settingsController));
router.put("/", settingsController.save.bind(settingsController));

export default router;
