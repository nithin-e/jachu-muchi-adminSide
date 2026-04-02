import { Router } from "express";
import { categoryController } from "../../config/injections/category.injection";

const  categoryRouter = Router();

categoryRouter.get("/all", categoryController.listAll.bind(categoryController));


export default categoryRouter;
