import { Router } from "express";
import { userManagementController } from "../../config/injections/user-management.injection";
import { handleValidation } from "../../validators/request.validator";
import {
  validateCreateUser,
  validateUpdateUser,
  validateUserIdParam,
} from "../../validators/user-management.validator";

const router = Router();

router.get("/all", userManagementController.listAll.bind(userManagementController));
router.get("/filter", userManagementController.filterUsers.bind(userManagementController));
router.get("/", userManagementController.list.bind(userManagementController));
router.get(
  "/:id",
  validateUserIdParam,
  handleValidation,
  userManagementController.getById.bind(userManagementController)
);
router.post(
  "/",
  validateCreateUser,
  handleValidation,
  userManagementController.create.bind(userManagementController)
);
router.put(
  "/:id",
  validateUserIdParam,
  validateUpdateUser,
  handleValidation,
  userManagementController.update.bind(userManagementController)
);
router.delete(
  "/:id",
  validateUserIdParam,
  handleValidation,
  userManagementController.delete.bind(userManagementController)
);

export default router;
