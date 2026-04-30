import { Router } from "express";
import { enquiryController } from "../../config/injections/enquiry.injection";

const router = Router();

router.get("/", enquiryController.listAll.bind(enquiryController));


export default router;
