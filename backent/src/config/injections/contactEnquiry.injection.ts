import { ContactEnquiryController } from "../../controllers/contactEnquiry.controller";
import { ContactEnquiryService } from "../../services/implementations/contactEnquiry.service";
import { EnquiryRepository } from "../../repositories/implementations/enquiry.repository";

const enquiryRepository = new EnquiryRepository();
const contactEnquiryService = new ContactEnquiryService(enquiryRepository);
export const contactEnquiryController = new ContactEnquiryController(
  contactEnquiryService
);
