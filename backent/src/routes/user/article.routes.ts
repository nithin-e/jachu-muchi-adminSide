import { Router } from "express";
import {
  articleController,

} from "../../config/injections/article.injection";

const articleRouter = Router();

articleRouter.get("/all", articleController.listAll.bind(articleController));


export default articleRouter;
