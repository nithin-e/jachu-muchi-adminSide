import { Router } from "express";
import {
  articleController,
  articleUploadMiddleware,
} from "../config/injections/article.injection";

const router = Router();

router.get("/all", articleController.listAll.bind(articleController));
router.get("/filter", articleController.filterArticles.bind(articleController));
router.get("/stats", articleController.stats.bind(articleController));
router.get("/", articleController.list.bind(articleController));
router.get("/:id", articleController.getById.bind(articleController));
router.post(
  "/",
  articleUploadMiddleware.handle.bind(articleUploadMiddleware),
  articleController.create.bind(articleController)
);
router.put(
  "/:id",
  articleUploadMiddleware.handle.bind(articleUploadMiddleware),
  articleController.update.bind(articleController)
);
router.delete("/:id", articleController.delete.bind(articleController));

export default router;
