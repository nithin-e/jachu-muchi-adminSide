import { Router } from "express";
import {
  bannerController,
  bannerUploadMiddleware,
} from "../config/dependency-injection";
import { BannerRouteRegistry } from "./BannerRouteRegistry";

const router = Router();

new BannerRouteRegistry(bannerController, bannerUploadMiddleware).register(
  router
);

export default router;
