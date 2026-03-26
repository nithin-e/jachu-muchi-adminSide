import { BranchController } from "../../controllers/branch.controller";
import { BranchRepository } from "../../repositories/implementations/branch.repository";
import { BranchService } from "../../services/implementations/branch.service";

const branchRepository = new BranchRepository();
const branchService = new BranchService(branchRepository);

export const branchController = new BranchController(branchService);
