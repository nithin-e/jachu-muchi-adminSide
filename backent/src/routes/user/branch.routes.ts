import { Router } from "express";
import { branchController } from "../../config/injections/branch.injection";

const BranchRouter = Router();

BranchRouter.get("/all", branchController.listAll.bind(branchController));


export default BranchRouter;
