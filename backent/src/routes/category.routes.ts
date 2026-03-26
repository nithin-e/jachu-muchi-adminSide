import { Router } from "express";
import { categoryController } from "../config/injections/category.injection";

const router = Router();

router.get("/all", categoryController.listAll.bind(categoryController));
router.get("/filter", categoryController.filterCategories.bind(categoryController));
router.get("/", categoryController.list.bind(categoryController));
router.post("/", categoryController.create.bind(categoryController));
router.put("/:id", categoryController.update.bind(categoryController));
router.delete("/:id", categoryController.delete.bind(categoryController));

export default router;
