import { Router } from "express";
import { enquiryController } from "../config/dependency-injection";

const router = Router();

router.get("/enquiries", enquiryController.listAll);
router.get("/enquiries/filter", enquiryController.filterEnquiries);
router.patch("/enquiries/:id/status", enquiryController.updateStatus);
router.delete("/enquiries/:id", enquiryController.deleteEnquiry);
router.get("/enquiries/:id", enquiryController.getById);
router.patch("/enquiries/:id/notes", enquiryController.updateNotes);

export default router;
