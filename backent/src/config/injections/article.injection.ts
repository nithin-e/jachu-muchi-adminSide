import { ArticleController } from "../../controllers/article.controller";
import { ArticleUploadMiddleware } from "../../middlewares/implementations/ArticleUploadMiddleware";
import { ArticleRepository } from "../../repositories/implementations/article.repository";
import { ArticleService } from "../../services/implementations/article.service";

const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);

export const articleController = new ArticleController(articleService);
export const articleUploadMiddleware = new ArticleUploadMiddleware();
