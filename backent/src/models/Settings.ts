import mongoose, { Document, Schema } from "mongoose";

export interface ISettingsDocument extends Document {
  whatsAppNumber: string;
  adminEmail: string;
  notificationEmails: string[];
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettingsDocument>(
  {
    whatsAppNumber: { type: String, default: "", trim: true },
    adminEmail: { type: String, default: "", trim: true },
    notificationEmails: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.model<ISettingsDocument>(
  "settings",
  settingsSchema
);
