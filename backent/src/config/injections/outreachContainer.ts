

import { OutreachController } from "../../controllers/OutreachController";
import { NotificationRepository } from "../../repositories/implementations/NotificationRepository";
import { MailDispatchService } from "../../services/implementations/MailDispatchService";
import createTransporter from "../mailerConfig";


const transporter = createTransporter();
const notificationRepository = new NotificationRepository();
const mailDispatchService = new MailDispatchService(
  notificationRepository,
  transporter
);
export const outreachController = new OutreachController(mailDispatchService);