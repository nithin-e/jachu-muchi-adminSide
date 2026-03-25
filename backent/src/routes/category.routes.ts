import { Router } from "express";
import { categoryController } from "../config/dependency-injection";
import { CategoryRouteRegistry } from "./CategoryRouteRegistry";

const router = Router();

new CategoryRouteRegistry(categoryController).register(router);

export default router;
