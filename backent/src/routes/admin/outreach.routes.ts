import { Router } from "express";
import { outreachController } from "../../config/injections/outreachContainer";

const router = Router();

router.post("/", outreachController.handleEnquiry);

export default router;
