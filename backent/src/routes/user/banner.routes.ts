import { Router } from "express";
import {
  bannerController,
  bannerUploadMiddleware,
} from "../../config/injections/banner.injection";

const bannerRouter = Router();

bannerRouter.get("/all", bannerController.listAll.bind(bannerController));



export default bannerRouter;
