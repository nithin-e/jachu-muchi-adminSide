import mongoose, { Document, Schema } from "mongoose";

export interface INotificationEmailDocument extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationEmailSchema = new Schema<INotificationEmailDocument>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

export const NotificationEmailModel = mongoose.model<INotificationEmailDocument>(
  "notificationemails",
  notificationEmailSchema
);
