import { Router } from "express";
import { outreachController } from "../../config/injections/outreachContainer";

const outreachRouter = Router();

outreachRouter.post("/", outreachController.handleEnquiry);

export default outreachRouter;