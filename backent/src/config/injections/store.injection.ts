import { StoreController } from "../../controllers/store.controller";
import { StoreUploadMiddleware } from "../../middlewares/implementations/StoreUploadMiddleware";
import { StoreRepository } from "../../repositories/implementations/store.repository";
import { StoreService } from "../../services/implementations/store.service";

const storeRepository = new StoreRepository();
const storeService = new StoreService(storeRepository);

export const storeController = new StoreController(storeService);
export const storeUploadMiddleware = new StoreUploadMiddleware();
