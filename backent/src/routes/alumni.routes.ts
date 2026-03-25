import { Router } from "express";
import {
  alumniController,
  alumniUploadMiddleware,
} from "../config/dependency-injection";
import { AlumniRouteRegistry } from "./AlumniRouteRegistry";

const router = Router();

new AlumniRouteRegistry(alumniController, alumniUploadMiddleware).register(
  router
);

export default router;
