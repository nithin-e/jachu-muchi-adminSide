import { Router } from "express";
import { branchController } from "../../config/injections/branch.injection";

const router = Router();

router.get("/all", branchController.listAll.bind(branchController));
router.get("/filter", branchController.filterBranches.bind(branchController));
router.get("/:id", branchController.getById.bind(branchController));
router.post("/", branchController.create.bind(branchController));
router.put("/:id", branchController.update.bind(branchController));
router.delete("/:id", branchController.delete.bind(branchController));

export default router;
