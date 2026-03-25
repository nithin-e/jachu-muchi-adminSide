import { CreateCourseInput, UpdateCourseInput } from "../../types/course.types";
import { CourseStatus, ICourseDocument } from "../../models/Course";

export interface ICourseRepository {
  create(payload: CreateCourseInput): Promise<ICourseDocument>;
  findById(id: string): Promise<ICourseDocument | null>;
  updateById(
    id: string,
    payload: UpdateCourseInput
  ): Promise<ICourseDocument | null>;
  deleteById(id: string): Promise<ICourseDocument | null>;
  /** Pass `null` to remove the stored image URL from the document. */
  setCourseImageById(
    id: string,
    imageUrl: string | null
  ): Promise<ICourseDocument | null>;

  filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: CourseStatus;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: ICourseDocument[];
    total: number;
    page: number;
    pages: number;
  }>;
}
