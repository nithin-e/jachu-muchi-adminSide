import { ITestimonialDocument } from "../../models/Testimonial";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../../types/testimonial.types";

export interface ITestimonialRepository {
  create(payload: CreateTestimonialInput): Promise<ITestimonialDocument>;
  findById(id: string): Promise<ITestimonialDocument | null>;
  updateById(
    id: string,
    payload: UpdateTestimonialInput
  ): Promise<ITestimonialDocument | null>;
  deleteById(id: string): Promise<ITestimonialDocument | null>;

  filter(params: {
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
