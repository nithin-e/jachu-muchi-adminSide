import { Router } from "express";
import { settingsController } from "../../config/injections/settings.injection";

const router = Router();

router.get("/", settingsController.get.bind(settingsController));
router.put("/", settingsController.save.bind(settingsController));
router.post("/notification-emails", settingsController.addNotificationEmail.bind(settingsController));
router.delete("/notification-emails/:id", settingsController.deleteNotificationEmail.bind(settingsController));

router.put("/email", settingsController.updateAdminEmail.bind(settingsController));
router.put("/notifications", settingsController.updateNotificationEmails.bind(settingsController));
router.put("/password", settingsController.updatePassword.bind(settingsController));

export default router;
