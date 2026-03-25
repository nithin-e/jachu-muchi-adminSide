import { Router } from "express";
import {
  articleController,
  articleUploadMiddleware,
} from "../config/dependency-injection";
import { ArticleRouteRegistry } from "./ArticleRouteRegistry";

const router = Router();

new ArticleRouteRegistry(articleController, articleUploadMiddleware).register(
  router
);

export default router;
