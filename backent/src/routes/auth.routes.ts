import { Router } from "express";
import { authController } from "../config/dependency-injection";

const router = Router();

router.post("/login", authController.login);

export default router;
