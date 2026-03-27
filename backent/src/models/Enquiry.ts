import mongoose, { Document, Schema } from "mongoose";

export type EnquiryStatus =
  | "New"
  | "Contacted"
  | "Interested"
  | "Converted"
  | "Closed";

export const ENQUIRY_STATUS_VALUES: EnquiryStatus[] = [
  "New",
  "Contacted",
  "Interested",
  "Converted",
  "Closed",
];

export type EnquiryType = "Course Enquiry" | "Normal Enquiry";

export const ENQUIRY_TYPE_VALUES: EnquiryType[] = [
  "Course Enquiry",
  "Normal Enquiry",
];

export interface IEnquiryDocument extends Document {
  name: string;
  phone: string;
  course: string;
  email: string;
  message: string;
  type: EnquiryType;
  status: EnquiryStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiryDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: ENQUIRY_TYPE_VALUES,
      default: "Course Enquiry",
    },
    status: {
      type: String,
      enum: ENQUIRY_STATUS_VALUES,
      default: "New",
    },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

// Query performance indexes for common search/filter/sort fields.
enquirySchema.index({ name: 1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ phone: 1 });
enquirySchema.index({ status: 1, type: 1, createdAt: -1 });

export const EnquiryModel = mongoose.model<IEnquiryDocument>(
  "enquiries",
  enquirySchema
);
