import mongoose, { Document, Schema } from "mongoose";
import { MESSAGES } from "../constants/messages";

export type BranchStatus = "Active" | "Inactive";

export const BRANCH_STATUS_VALUES: BranchStatus[] = ["Active", "Inactive"];

export interface IBranchDocument extends Document {
  name: string;
  location: string;
  phoneNumbers: string[];
  mapUrl: string;
  email: string;
  status: BranchStatus;
  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new Schema<IBranchDocument>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    phoneNumbers: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: MESSAGES.BRANCH.PHONE_REQUIRED,
      },
    },
    mapUrl: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: BRANCH_STATUS_VALUES,
      default: "Active",
    },
  },
  { timestamps: true }
);

export const BranchModel = mongoose.model<IBranchDocument>(
  "Branch",
  branchSchema,
  "branches"
);
