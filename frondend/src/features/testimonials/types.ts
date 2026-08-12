export type TestimonialStatus = "Active" | "Inactive";

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  content: string;
  status: TestimonialStatus;
}
