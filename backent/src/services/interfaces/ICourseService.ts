import { CreateCourseInput, UpdateCourseInput } from "../../types/course.types";
import { ICourseDocument } from "../../models/Course";

export interface ICourseService {
  createCourse(input: CreateCourseInput): Promise<ICourseDocument>;
  updateCourse(
    courseId: string,
    input: UpdateCourseInput
  ): Promise<ICourseDocument>;
  deleteCourse(courseId: string): Promise<void>;
  /** Replace course image only; deletes previous file when applicable. */
  uploadCourseImage(
    courseId: string,
    imageUrl: string
  ): Promise<ICourseDocument>;
  /** Remove image from course and delete file from disk. */
  removeCourseImage(courseId: string): Promise<ICourseDocument>;

  filterCourses(params: {
    page: number;
    limit: number;
    search?: string;
    status?: "Active" | "Inactive" | string;
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
