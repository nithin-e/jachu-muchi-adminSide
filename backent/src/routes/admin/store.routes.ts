import { Router } from "express";
import {
  storeController,
  storeUploadMiddleware,
} from "../../config/injections/store.injection";

const router = Router();

router.get("/all", storeController.listAll.bind(storeController));
router.get("/:id", storeController.getById.bind(storeController));
router.post(
  "/",
  storeUploadMiddleware.handle.bind(storeUploadMiddleware),
  storeController.create.bind(storeController)
);
router.put(
  "/:id",
  storeUploadMiddleware.handle.bind(storeUploadMiddleware),
  storeController.update.bind(storeController)
);
router.delete("/:id", storeController.delete.bind(storeController));

export default router;
