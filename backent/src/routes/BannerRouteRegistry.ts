import { Router } from "express";
import { BannerController } from "../controllers/banner.controller";
import { ICourseUploadMiddleware } from "../middlewares/interfaces/ICourseUploadMiddleware";

export class BannerRouteRegistry {
  constructor(
    private readonly bannerController: BannerController,
    private readonly bannerUploadMiddleware: ICourseUploadMiddleware
  ) {}

  register(router: Router): void {
    router.get(
      "/banners/all",
      this.bannerController.listAll.bind(this.bannerController)
    );

    router.get(
      "/banners",
      this.bannerController.list.bind(this.bannerController)
    );

    router.get(
      "/banners/:id",
      this.bannerController.getById.bind(this.bannerController)
    );

    router.post(
      "/banners",
      this.bannerUploadMiddleware.handle.bind(this.bannerUploadMiddleware),
      this.bannerController.create.bind(this.bannerController)
    );

    router.put(
      "/banners/:id",
      this.bannerUploadMiddleware.handle.bind(this.bannerUploadMiddleware),
      this.bannerController.update.bind(this.bannerController)
    );

    router.delete(
      "/banners/:id",
      this.bannerController.delete.bind(this.bannerController)
    );
  }
}
