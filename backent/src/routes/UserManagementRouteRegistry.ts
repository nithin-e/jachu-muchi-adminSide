import { Router } from "express";
import { UserManagementController } from "../controllers/userManagement.controller";

export class UserManagementRouteRegistry {
  constructor(
    private readonly userManagementController: UserManagementController
  ) {}

  register(router: Router): void {
    router.get(
      "/users/all",
      this.userManagementController.listAll.bind(this.userManagementController)
    );

    router.get(
      "/users/filter",
      this.userManagementController.filterUsers.bind(this.userManagementController)
    );

    router.get(
      "/users",
      this.userManagementController.list.bind(this.userManagementController)
    );

    router.get(
      "/users/:id",
      this.userManagementController.getById.bind(this.userManagementController)
    );

    router.post(
      "/users",
      this.userManagementController.create.bind(this.userManagementController)
    );

    router.put(
      "/users/:id",
      this.userManagementController.update.bind(this.userManagementController)
    );

    router.delete(
      "/users/:id",
      this.userManagementController.delete.bind(this.userManagementController)
    );
  }
}
