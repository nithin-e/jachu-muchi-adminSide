import mongoose, { Document, Schema } from "mongoose";

export interface ITestimonialDocument extends Document {
  name: string;
  course: string;
  message: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonialDocument>(
  {
    name: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    profileImageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const TestimonialModel = mongoose.model<ITestimonialDocument>(
  "testimonials",
  testimonialSchema
);
