import { BannerController } from "../../controllers/banner.controller";
import { BannerUploadMiddleware } from "../../middlewares/implementations/BannerUploadMiddleware";
import { BannerRepository } from "../../repositories/implementations/banner.repository";
import { BannerService } from "../../services/implementations/banner.service";

const bannerRepository = new BannerRepository();
const bannerService = new BannerService(bannerRepository);

export const bannerController = new BannerController(bannerService);
export const bannerUploadMiddleware = new BannerUploadMiddleware();
