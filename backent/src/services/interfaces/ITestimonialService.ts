import { ITestimonialDocument } from "../../models/Testimonial";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../../types/testimonial.types";

export interface ITestimonialService {
  createTestimonial(
    input: CreateTestimonialInput
  ): Promise<ITestimonialDocument>;
  updateTestimonial(
    testimonialId: string,
    input: UpdateTestimonialInput
  ): Promise<ITestimonialDocument>;
  deleteTestimonial(testimonialId: string): Promise<void>;
  getTestimonialById(testimonialId: string): Promise<ITestimonialDocument>;

  filterTestimonials(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: ITestimonialDocument[];
    total: number;
    page: number;
    pages: number;
  }>;
}
