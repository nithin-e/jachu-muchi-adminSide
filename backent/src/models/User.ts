import mongoose, { Schema, Document } from "mongoose";

export const ADMIN_USER_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type AdminUserStatus = "Active" | "Inactive";

export const ADMIN_USER_STATUS_VALUES: AdminUserStatus[] = [
  ADMIN_USER_STATUS.ACTIVE,
  ADMIN_USER_STATUS.INACTIVE,
];

/** Display roles used in the admin UI (legacy rows may still use lowercase e.g. admin). */
export const ADMIN_USER_ROLE = {
  ADMIN: "Admin",
  SUB_ADMIN: "Sub Admin",
  EDITOR: "Editor",
} as const;

export type AdminUserRole = "Admin" | "Sub Admin" | "Editor";

export const ADMIN_USER_ROLE_VALUES: AdminUserRole[] = [
  ADMIN_USER_ROLE.ADMIN,
  ADMIN_USER_ROLE.SUB_ADMIN,
  ADMIN_USER_ROLE.EDITOR,
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
    role: {
      type: String,
      required: true,
      trim: true,
      default: ADMIN_USER_ROLE.ADMIN,
    },
    status: {
      type: String,
      enum: ADMIN_USER_STATUS_VALUES,
      default: ADMIN_USER_STATUS.ACTIVE,
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

export const UserModel = mongoose.model<IUserDocument>("admins", userSchema);
