import { AlumniController } from "../../controllers/alumni.controller";
import { AlumniUploadMiddleware } from "../../middlewares/implementations/AlumniUploadMiddleware";
import { AlumniRepository } from "../../repositories/implementations/alumni.repository";
import { AlumniService } from "../../services/implementations/alumni.service";

const alumniRepository = new AlumniRepository();
const alumniService = new AlumniService(alumniRepository);

export const alumniController = new AlumniController(alumniService);
export const alumniUploadMiddleware = new AlumniUploadMiddleware();
