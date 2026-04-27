

import { Router } from "express";
import { testimonialController } from "../../config/injections/testimonial.injection";

const testimonialRouter = Router();

testimonialRouter.get("/all", testimonialController.listAll.bind(testimonialController));
testimonialRouter.get("/:id", testimonialController.getById.bind(testimonialController));
testimonialRouter.post("/", testimonialController.create.bind(testimonialController));
testimonialRouter.put("/:id", testimonialController.update.bind(testimonialController));
testimonialRouter.delete("/:id", testimonialController.delete.bind(testimonialController));

export default testimonialRouter;

