import { Router } from "express";
import { getAllEnquiries } from "../controllers/enquiry.controller";
import { enquiryController } from "../config/dependency-injection";

const router = Router();

router.get("/enquiries", getAllEnquiries);
router.patch("/enquiries/:id/status", enquiryController.updateStatus);

export default router;
