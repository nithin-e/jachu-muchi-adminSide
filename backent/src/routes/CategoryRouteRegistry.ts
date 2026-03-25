import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

export class CategoryRouteRegistry {
  constructor(private readonly categoryController: CategoryController) {}

  register(router: Router): void {
    router.get(
      "/categories/all",
      this.categoryController.listAll.bind(this.categoryController)
    );

    router.get(
      "/categories/filter",
      this.categoryController.filterCategories.bind(this.categoryController)
    );

    router.get(
      "/categories",
      this.categoryController.list.bind(this.categoryController)
    );

    router.post(
      "/categories",
      this.categoryController.create.bind(this.categoryController)
    );

    router.put(
      "/categories/:id",
      this.categoryController.update.bind(this.categoryController)
    );

    router.delete(
      "/categories/:id",
      this.categoryController.delete.bind(this.categoryController)
    );
  }
}
