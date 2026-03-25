import { Router } from "express";
import { ArticleController } from "../controllers/article.controller";
import { ICourseUploadMiddleware } from "../middlewares/interfaces/ICourseUploadMiddleware";

/**
 * News/article routes. Register `/articles/stats` before `/articles/:id`.
 */
export class ArticleRouteRegistry {
  constructor(
    private readonly articleController: ArticleController,
    private readonly articleUploadMiddleware: ICourseUploadMiddleware
  ) {}

  register(router: Router): void {
    router.get(
      "/articles/all",
      this.articleController.listAll.bind(this.articleController)
    );

    // Filtering/search endpoint
    router.get(
      "/articles/filter",
      this.articleController.filterArticles.bind(this.articleController)
    );

    // Alias (in case UI calls `/news/*` instead of `/articles/*`)
    router.get(
      "/news/all",
      this.articleController.listAll.bind(this.articleController)
    );

    // Alias (filtering)
    router.get(
      "/news/filter",
      this.articleController.filterArticles.bind(this.articleController)
    );

    router.get(
      "/articles/stats",
      this.articleController.stats.bind(this.articleController)
    );

    router.get(
      "/articles",
      this.articleController.list.bind(this.articleController)
    );

    router.get(
      "/articles/:id",
      this.articleController.getById.bind(this.articleController)
    );

    router.post(
      "/articles",
      this.articleUploadMiddleware.handle.bind(this.articleUploadMiddleware),
      this.articleController.create.bind(this.articleController)
    );

    router.put(
      "/articles/:id",
      this.articleUploadMiddleware.handle.bind(this.articleUploadMiddleware),
      this.articleController.update.bind(this.articleController)
    );

    router.delete(
      "/articles/:id",
      this.articleController.delete.bind(this.articleController)
    );
  }
}
