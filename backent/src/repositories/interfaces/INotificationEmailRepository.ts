import { INotificationEmailDocument } from "../../models/NotificationEmail";

export interface INotificationEmailRepository {
  findAll(): Promise<INotificationEmailDocument[]>;
  create(email: string): Promise<INotificationEmailDocument>;
  deleteById(id: string): Promise<INotificationEmailDocument | null>;
  findByEmail(email: string): Promise<INotificationEmailDocument | null>;
  getAllEmails(): Promise<string[]>;
}
