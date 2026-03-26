import { UserManagementController } from "../../controllers/userManagement.controller";
import { UserManagementRepository } from "../../repositories/implementations/user-management.repository";
import { UserManagementService } from "../../services/implementations/user-management.service";

const userManagementRepository = new UserManagementRepository();
const userManagementService = new UserManagementService(userManagementRepository);

export const userManagementController = new UserManagementController(
  userManagementService
);
