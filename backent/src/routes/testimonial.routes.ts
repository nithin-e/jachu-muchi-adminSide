import { Router } from "express";
import {
  testimonialController,
  testimonialUploadMiddleware,
} from "../config/dependency-injection";
import { TestimonialRouteRegistry } from "./TestimonialRouteRegistry";

const router = Router();

new TestimonialRouteRegistry(
  testimonialController,
  testimonialUploadMiddleware
).register(router);

export default router;
