import { EnquiryController } from "../../controllers/enquiry.controller";
import { EnquiryRepository } from "../../repositories/implementations/enquiry.repository";
import { EnquiryService } from "../../services/implementations/enquiry.service";

const enquiryRepository = new EnquiryRepository();
const enquiryService = new EnquiryService(enquiryRepository);

export const enquiryController = new EnquiryController(enquiryService);
