import { TestimonialStatus } from "../models/Testimonial";

export interface CreateTestimonialInput {
  name: string;
  role?: string;
  avatarUrl?: string;
  content: string;
  status: TestimonialStatus;
}

/** Omitting `avatarUrl` keeps the existing image on update. */
export interface UpdateTestimonialInput {
  name: string;
  role?: string;
  avatarUrl?: string;
  content: string;
  status: TestimonialStatus;
}
