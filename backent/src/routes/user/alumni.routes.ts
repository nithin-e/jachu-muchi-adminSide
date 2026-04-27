import { Router } from "express";
import { alumniController } from "../../config/injections/alumni.injection";

const router = Router();

router.get("/all", alumniController.listAll.bind(alumniController));
router.get("/:id", alumniController.getById.bind(alumniController));
router.post("/", alumniController.create.bind(alumniController));
router.put("/:id", alumniController.update.bind(alumniController));
router.delete("/:id", alumniController.delete.bind(alumniController));

export default router;
