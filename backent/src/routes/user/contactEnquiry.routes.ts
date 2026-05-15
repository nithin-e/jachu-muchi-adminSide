import { Router } from "express";
import { contactEnquiryController } from "../../config/injections/contactEnquiry.injection";

const contactEnquiryRouter = Router();

contactEnquiryRouter.post("/send-enquiry", contactEnquiryController.sendEnquiry);

export default contactEnquiryRouter;
