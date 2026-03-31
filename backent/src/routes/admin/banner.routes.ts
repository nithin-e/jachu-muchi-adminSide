import { Router } from "express";
import {
  bannerController,
  bannerUploadMiddleware,
} from "../../config/injections/banner.injection";

const router = Router();

router.get("/all", bannerController.listAll.bind(bannerController));
router.get("/", bannerController.list.bind(bannerController));
router.get("/:id", bannerController.getById.bind(bannerController));
router.post(
  "/",
  bannerUploadMiddleware.handle.bind(bannerUploadMiddleware),
  bannerController.create.bind(bannerController)
);
router.put(
  "/:id",
  bannerUploadMiddleware.handle.bind(bannerUploadMiddleware),
  bannerController.update.bind(bannerController)
);
router.delete("/:id", bannerController.delete.bind(bannerController));

export default router;
