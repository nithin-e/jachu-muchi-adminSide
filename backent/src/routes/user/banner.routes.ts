import { Router } from "express";
import {
  bannerController,
} from "../../config/injections/banner.injection";

const bannerRouter = Router();

bannerRouter.get("/", bannerController.getPublicBanners.bind(bannerController));
bannerRouter.get("/all", bannerController.getPublicBanners.bind(bannerController));

export default bannerRouter;
