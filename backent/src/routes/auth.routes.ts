import { Router } from "express";
import { authController } from "../config/injections/auth.injection";
import { validateLogin } from "../validators/auth.validator";
import { handleValidation } from "../validators/request.validator";

const router = Router();

router.post(
  "/login",
  validateLogin,
  handleValidation,
  authController.login.bind(authController)
);

export default router;
