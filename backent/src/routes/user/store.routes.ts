import { Router } from "express";
import { storeController } from "../../config/injections/store.injection";

const router = Router();

router.get("/all", storeController.listAll.bind(storeController));
router.get("/:id", storeController.getById.bind(storeController));

export default router;
