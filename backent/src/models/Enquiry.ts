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

export interface IEnquiryDocument extends Document {
  name: string;
  phone: string;
  course: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiryDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ENQUIRY_STATUS_VALUES,
      default: "New",
    },
  },
  { timestamps: true }
);

export const EnquiryModel = mongoose.model<IEnquiryDocument>(
  "enquiries",
  enquirySchema
);
