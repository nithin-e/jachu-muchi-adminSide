import { ContactEnquiryController } from "../../controllers/contactEnquiry.controller";
import { ContactEnquiryService } from "../../services/implementations/contactEnquiry.service";

const contactEnquiryService = new ContactEnquiryService();
export const contactEnquiryController = new ContactEnquiryController(
  contactEnquiryService
);
