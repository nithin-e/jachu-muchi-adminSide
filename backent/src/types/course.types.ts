import { CourseStatus } from "../models/Course";

export interface CreateCourseInput {
  name: string;
  type: string;
  duration: string;
  keyDetails: string;
  eligibility: string;
  status?: CourseStatus;
  imageUrl?: string;
}

/** Full replace of editable fields; `imageUrl` omitted = keep existing image. */
export interface UpdateCourseInput {
  name: string;
  type: string;
  duration: string;
  keyDetails: string;
  eligibility: string;
  status?: CourseStatus;
  imageUrl?: string;
}
