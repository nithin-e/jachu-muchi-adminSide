import { Router } from "express";
import { enquiryController } from "../config/injections/enquiry.injection";

const router = Router();

router.get("/", enquiryController.listAll.bind(enquiryController));
router.get("/filter", enquiryController.filterEnquiries.bind(enquiryController));
router.patch("/:id/status", enquiryController.updateStatus.bind(enquiryController));
router.delete("/:id", enquiryController.deleteEnquiry.bind(enquiryController));
router.get("/:id", enquiryController.getById.bind(enquiryController));
router.patch("/:id/notes", enquiryController.updateNotes.bind(enquiryController));

export default router;
