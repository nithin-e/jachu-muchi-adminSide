import { OutreachController } from "../../controllers/outreach.controller";
import { NotificationRepository } from "../../repositories/implementations/NotificationRepository";
import { EnquiryRepository } from "../../repositories/implementations/enquiry.repository";
import { MailDispatchService } from "../../services/implementations/MailDispatchService";
import createTransporter from "../mailerConfig";

const transporter = createTransporter();
const notificationRepository = new NotificationRepository();
const enquiryRepository = new EnquiryRepository();
const mailDispatchService = new MailDispatchService(
  notificationRepository,
  transporter
);
export const outreachController = new OutreachController(
  mailDispatchService,
  enquiryRepository
);
