import { Router } from "express";
import { seoController } from "../config/injections/seo.injection";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", seoController.list.bind(seoController));
router.post("/", authenticateToken, seoController.upsert.bind(seoController));
router.put("/", authenticateToken, seoController.upsert.bind(seoController));

export default router;
