import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";

export class BranchRouteRegistry {
  constructor(private readonly branchController: BranchController) {}

  register(router: Router): void {
    router.get(
      "/branches/all",
      this.branchController.listAll.bind(this.branchController)
    );

    router.get(
      "/branches/filter",
      this.branchController.filterBranches.bind(this.branchController)
    );

    router.get(
      "/branches",
      this.branchController.list.bind(this.branchController)
    );

    router.get(
      "/branches/:id",
      this.branchController.getById.bind(this.branchController)
    );

    router.post(
      "/branches",
      this.branchController.create.bind(this.branchController)
    );

    router.put(
      "/branches/:id",
      this.branchController.update.bind(this.branchController)
    );

    router.delete(
      "/branches/:id",
      this.branchController.delete.bind(this.branchController)
    );
  }
}
