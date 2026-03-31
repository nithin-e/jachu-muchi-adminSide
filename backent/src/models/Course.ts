import mongoose, { Document, Schema } from "mongoose";

export const COURSE_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type CourseStatus = "Active" | "Inactive";
export const COURSE_STATUS_VALUES: CourseStatus[] = [
  COURSE_STATUS.ACTIVE,
  COURSE_STATUS.INACTIVE,
];

export interface ICourseDocument extends Document {
  name: string;
  type: string;
  duration: string;
  CourseOverview: string;  // Main course description
  eligibility: string;
  status?: CourseStatus;
  imageUrl?: string;
  university: string;
  college: string;
  courseRoll: string;      // Course writeup/roll description
  syllabus: string;        // Comma-separated or array
  courseHighlights: string; // Key highlights
  careerOutcomes: string;   // Career opportunities
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourseDocument>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    CourseOverview: { type: String, required: true, trim: true },
    eligibility: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: COURSE_STATUS_VALUES,
      default: COURSE_STATUS.ACTIVE,
    },
    imageUrl: { type: String, trim: true, default: undefined },
    university: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    courseRoll: { type: String, required: true, trim: true },
    syllabus: { type: String, trim: true, default: "" },
    courseHighlights: { type: String, trim: true, default: "" },
    careerOutcomes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model<ICourseDocument>(
  "courses",
  courseSchema
);
