import { CourseStatus } from "../models/Course";

export interface CreateCourseInput {
  name: string;
  type: string;
  duration: string;
  CourseOverview: string;
  eligibility: string;
  university: string;
  college: string;
  courseRoll: string;
  syllabus?: string;
  courseHighlights?: string;
  careerOutcomes?: string;
  status?: CourseStatus;
  imageUrl?: string;
}

export interface UpdateCourseInput {
  name: string;
  type: string;
  duration: string;
  CourseOverview: string;
  eligibility: string;
  university: string;
  college: string;
  courseRoll: string;
  syllabus?: string;
  courseHighlights?: string;
  careerOutcomes?: string;
  status?: CourseStatus;
  imageUrl?: string;
}
