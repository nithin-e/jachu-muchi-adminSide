import { Router } from "express";
import { branchController } from "../config/dependency-injection";
import { BranchRouteRegistry } from "./BranchRouteRegistry";

const router = Router();

new BranchRouteRegistry(branchController).register(router);

export default router;
