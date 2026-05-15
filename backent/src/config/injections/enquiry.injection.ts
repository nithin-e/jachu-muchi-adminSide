import { EnquiryController } from "../../controllers/enquiry.controller";
import { EnquiryRepository } from "../../repositories/implementations/enquiry.repository";
import { EnquiryService } from "../../services/implementations/enquiry.service";
import { NotificationRepository } from "../../repositories/implementations/NotificationRepository";
import { MailDispatchService } from "../../services/implementations/MailDispatchService";
import createTransporter from "../mailerConfig";

const transporter = createTransporter();
const notificationRepository = new NotificationRepository();
const enquiryRepository = new EnquiryRepository();
const mailDispatchService = new MailDispatchService(
  notificationRepository,
  transporter
);
const enquiryService = new EnquiryService(enquiryRepository, mailDispatchService);

export const enquiryController = new EnquiryController(enquiryService);
