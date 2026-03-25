import { Router } from "express";
import { userManagementController } from "../config/dependency-injection";
import { UserManagementRouteRegistry } from "./UserManagementRouteRegistry";

const router = Router();

new UserManagementRouteRegistry(userManagementController).register(router);

export default router;
