import { CategoryController } from "../../controllers/category.controller";
import { CategoryRepository } from "../../repositories/implementations/category.repository";
import { CategoryService } from "../../services/implementations/category.service";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export const categoryController = new CategoryController(categoryService);
