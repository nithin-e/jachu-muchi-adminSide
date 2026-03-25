import { Router } from "express";
import {
  courseController,
  courseUploadMiddleware,
} from "../config/dependency-injection";
import { CourseRouteRegistry } from "./CourseRouteRegistry";

const router = Router();

new CourseRouteRegistry(courseController, courseUploadMiddleware).register(
  router
);

export default router;
