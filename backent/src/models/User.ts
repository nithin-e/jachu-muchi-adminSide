import mongoose, { Schema, Document } from "mongoose";

export type AdminUserStatus = "Active" | "Inactive";

export const ADMIN_USER_STATUS_VALUES: AdminUserStatus[] = [
  "Active",
  "Inactive",
];

/** Display roles used in the admin UI (legacy rows may still use lowercase e.g. admin). */
export type AdminUserRole = "Admin" | "Sub Admin" | "Editor";

export const ADMIN_USER_ROLE_VALUES: AdminUserRole[] = [
  "Admin",
  "Sub Admin",
  "Editor",
];

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  status: AdminUserStatus;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, trim: true, default: "Admin" },
    status: {
      type: String,
      enum: ADMIN_USER_STATUS_VALUES,
      default: "Active",
    },
  },
  { timestamps: true }
);

const stripPassword = (_doc: unknown, ret: unknown) => {
  const plain = ret as Record<string, unknown>;
  const { password: _p, ...rest } = plain;
  return rest;
};

userSchema.set("toJSON", { transform: stripPassword });
userSchema.set("toObject", { transform: stripPassword });

export const UserModel = mongoose.model<IUserDocument>("admin", userSchema);
