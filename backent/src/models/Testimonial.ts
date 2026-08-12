import mongoose, { Document, Schema } from "mongoose";

export const TESTIMONIAL_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type TestimonialStatus = "Active" | "Inactive";

export const TESTIMONIAL_STATUS_VALUES: TestimonialStatus[] = [
  TESTIMONIAL_STATUS.ACTIVE,
  TESTIMONIAL_STATUS.INACTIVE,
];

export interface ITestimonialDocument extends Document {
  name: string;
  role?: string;
  avatarUrl?: string;
  content: string;
  status: TestimonialStatus;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonialDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    content: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: TESTIMONIAL_STATUS_VALUES,
      default: TESTIMONIAL_STATUS.ACTIVE,
      required: true,
    },
  },
  { timestamps: true }
);

export const TestimonialModel = mongoose.model<ITestimonialDocument>(
  "testimonials",
  testimonialSchema
);
