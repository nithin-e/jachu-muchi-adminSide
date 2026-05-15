import mongoose, { Document, Schema } from "mongoose";

export interface ISettingsDocument extends Document {
  adminEmail: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettingsDocument>(
  {
    adminEmail: { type: String, default: "", trim: true },
    passwordHash: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.model<ISettingsDocument>(
  "settings",
  settingsSchema
);
