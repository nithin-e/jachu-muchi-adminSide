

import { Router } from "express";
import { outreachController } from "../../config/injections/outreachContainer";
import { testimonialController } from "../../config/injections/testimonial.injection";

const testimonialRouter = Router();


testimonialRouter.get("/all", testimonialController.listAll.bind(testimonialController));


export default testimonialRouter;

