import { INotificationEmailDocument, NotificationEmailModel } from "../../models/NotificationEmail";
import { INotificationEmailRepository } from "../interfaces/INotificationEmailRepository";

export class NotificationEmailRepository implements INotificationEmailRepository {
  async findAll(): Promise<INotificationEmailDocument[]> {
    return NotificationEmailModel.find().sort({ createdAt: 1 });
  }

  async create(email: string): Promise<INotificationEmailDocument> {
    const doc = new NotificationEmailModel({ email: email.toLowerCase() });
    return doc.save();
  }

  async deleteById(id: string): Promise<INotificationEmailDocument | null> {
    return NotificationEmailModel.findByIdAndDelete(id);
  }

  async findByEmail(email: string): Promise<INotificationEmailDocument | null> {
    return NotificationEmailModel.findOne({ email: email.toLowerCase() });
  }

  async getAllEmails(): Promise<string[]> {
    const docs = await NotificationEmailModel.find().select("email").lean();
    return docs.map((d) => d.email);
  }
}
