

import { Router } from "express";
import { outreachController } from "../../config/injections/outreachContainer";

const testimonialRouter = Router();

testimonialRouter.post("/", outreachController.handleEnquiry);

export default testimonialRouter;

