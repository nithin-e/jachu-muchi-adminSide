import mongoose, { Document, Schema } from "mongoose";

export type CourseStatus = "Active" | "Inactive";
export const COURSE_STATUS_VALUES: CourseStatus[] = ["Active", "Inactive"];

export interface ICourseDocument extends Document {
  name: string;
  type: string;
  duration: string;
  keyDetails: string;
  eligibility: string;
  status?: CourseStatus;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourseDocument>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    keyDetails: { type: String, required: true, trim: true },
    eligibility: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: COURSE_STATUS_VALUES,
      default: "Active",
    },
    imageUrl: { type: String, trim: true, default: undefined },
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model<ICourseDocument>(
  "courses",
  courseSchema
);
