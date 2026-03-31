import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import {
  COURSE_STATUS_VALUES,
  CourseStatus,
  ICourseDocument,
} from "../../models/Course";
import { ICourseRepository } from "../../repositories/interfaces/ICourseRepository";
import { CreateCourseInput, UpdateCourseInput } from "../../types/course.types";
import { ICourseService } from "../interfaces/ICourseService";
import { throwBadRequest, throwNotFound } from "../../utils/http-errors.helper";
import { MESSAGES } from "../../constants/messages";

function tryRemoveCourseImageFile(imageUrl?: string): void {
  if (!imageUrl?.trim()) return;
  const base = "/uploads/courses/";
  if (!imageUrl.includes(base)) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename === "." || filename === "..") return;
  const absolute = path.join(process.cwd(), "uploads", "courses", filename);
  fs.unlink(absolute, () => {
    /* ignore missing file */
  });
}

export class CourseService implements ICourseService {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async createCourse(input: CreateCourseInput): Promise<ICourseDocument> {
    const name = input.name?.trim();
    const type = input.type?.trim();
    const duration = input.duration?.trim();
    const CourseOverview = input.CourseOverview?.trim();
    const eligibility = input.eligibility?.trim();
    const university = input.university?.trim();
    const college = input.college?.trim();
    const courseRoll = input.courseRoll?.trim();
    const syllabus = input.syllabus?.trim();
    const courseHighlights = input.courseHighlights?.trim();
    const careerOutcomes = input.careerOutcomes?.trim();
    const status = input.status;

    if (!name) throwBadRequest(MESSAGES.COURSE.NAME_REQUIRED);
    if (!type) throwBadRequest(MESSAGES.COURSE.TYPE_REQUIRED);
    if (!duration) throwBadRequest(MESSAGES.COURSE.DURATION_REQUIRED);
    if (!CourseOverview) throwBadRequest("Course overview is required");
    if (!eligibility) throwBadRequest(MESSAGES.COURSE.ELIGIBILITY_REQUIRED);
    if (!university) throwBadRequest("University is required");
    if (!college) throwBadRequest("College is required");
    if (!courseRoll) throwBadRequest("Course roll/writeup is required");

    if (status !== undefined) {
      if (!COURSE_STATUS_VALUES.includes(status)) {
        throwBadRequest(
          MESSAGES.COURSE.STATUS_MUST_BE_ACTIVE_OR_INACTIVE_LOWERCASE
        );
      }
    }

    return this.courseRepository.create({
      name,
      type,
      duration,
      CourseOverview,
      eligibility,
      university,
      college,
      courseRoll,
      ...(syllabus ? { syllabus } : {}),
      ...(courseHighlights ? { courseHighlights } : {}),
      ...(careerOutcomes ? { careerOutcomes } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(input.imageUrl?.trim()
        ? { imageUrl: input.imageUrl.trim() }
        : {}),
    });
  }

  async updateCourse(
    courseId: string,
    input: UpdateCourseInput
  ): Promise<ICourseDocument> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throwBadRequest(MESSAGES.COURSE.INVALID_ID);
    }

    const name = input.name?.trim();
    const type = input.type?.trim();
    const duration = input.duration?.trim();
    const CourseOverview = input.CourseOverview?.trim();
    const eligibility = input.eligibility?.trim();
    const university = input.university?.trim();
    const college = input.college?.trim();
    const courseRoll = input.courseRoll?.trim();
    const syllabus = input.syllabus?.trim();
    const courseHighlights = input.courseHighlights?.trim();
    const careerOutcomes = input.careerOutcomes?.trim();
    const status = input.status;

    if (!name) throwBadRequest(MESSAGES.COURSE.NAME_REQUIRED);
    if (!type) throwBadRequest(MESSAGES.COURSE.TYPE_REQUIRED);
    if (!duration) throwBadRequest(MESSAGES.COURSE.DURATION_REQUIRED);
    if (!CourseOverview) throwBadRequest("Course overview is required");
    if (!eligibility) throwBadRequest(MESSAGES.COURSE.ELIGIBILITY_REQUIRED);
    if (!university) throwBadRequest("University is required");
    if (!college) throwBadRequest("College is required");
    if (!courseRoll) throwBadRequest("Course roll/writeup is required");

    if (status !== undefined) {
      if (!COURSE_STATUS_VALUES.includes(status)) {
        throwBadRequest(
          MESSAGES.COURSE.STATUS_MUST_BE_ACTIVE_OR_INACTIVE_LOWERCASE
        );
      }
    }

    const existing = await this.courseRepository.findById(courseId);
    if (!existing) {
      throwNotFound(MESSAGES.COURSE.NOT_FOUND);
    }

    const payload: UpdateCourseInput = {
      name,
      type,
      duration,
      CourseOverview,
      eligibility,
      university,
      college,
      courseRoll,
      ...(syllabus ? { syllabus } : {}),
      ...(courseHighlights ? { courseHighlights } : {}),
      ...(careerOutcomes ? { careerOutcomes } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(input.imageUrl !== undefined
        ? { imageUrl: input.imageUrl?.trim() || undefined }
        : {}),
    };

    const updated = await this.courseRepository.updateById(courseId, payload);
    if (!updated) {
      throwNotFound(MESSAGES.COURSE.NOT_FOUND);
    }

    if (
      input.imageUrl !== undefined &&
      existing.imageUrl &&
      updated.imageUrl &&
      updated.imageUrl !== existing.imageUrl
    ) {
      tryRemoveCourseImageFile(existing.imageUrl);
    }

    return updated;
  }

  async deleteCourse(courseId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throwBadRequest(MESSAGES.COURSE.INVALID_ID);
    }

    const removed = await this.courseRepository.deleteById(courseId);
    if (!removed) {
      throwNotFound(MESSAGES.COURSE.NOT_FOUND);
    }

    tryRemoveCourseImageFile(removed.imageUrl);
  }

  async uploadCourseImage(
    courseId: string,
    imageUrl: string
  ): Promise<ICourseDocument> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throwBadRequest(MESSAGES.COURSE.INVALID_ID);
    }

    const trimmed = imageUrl?.trim();
    if (!trimmed) {
      throwBadRequest(MESSAGES.COURSE.IMAGE_FILE_REQUIRED);
    }

    const existing = await this.courseRepository.findById(courseId);
    if (!existing) {
      throwNotFound(MESSAGES.COURSE.NOT_FOUND);
    }

    const updated = await this.courseRepository.setCourseImageById(
      courseId,
      trimmed
    );
    if (!updated) {
      throwNotFound(MESSAGES.COURSE.NOT_FOUND);
    }

    if (
      existing.imageUrl &&
      updated.imageUrl &&
      existing.imageUrl !== updated.imageUrl
    ) {
      tryRemoveCourseImageFile(existing.imageUrl);
    }

    return updated;
  }

  async removeCourseImage(courseId: string): Promise<ICourseDocument> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throwBadRequest(MESSAGES.COURSE.INVALID_ID);
    }

    const existing = await this.courseRepository.findById(courseId);
    if (!existing) {
      throwNotFound(MESSAGES.COURSE.NOT_FOUND);
    }

    if (existing.imageUrl) {
      tryRemoveCourseImageFile(existing.imageUrl);
    }

    const updated = await this.courseRepository.setCourseImageById(
      courseId,
      null
    );
    if (!updated) {
      throwNotFound(MESSAGES.COURSE.NOT_FOUND);
    }

    return updated;
  }

  async filterCourses(params: {
    page: number;
    limit: number;
    search?: string;
    status?: CourseStatus | string;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: ICourseDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const { page, limit, search, status, type, sortBy, order = "desc" } =
      params;

    if (!Number.isFinite(page) || page < 1) {
      throwBadRequest(MESSAGES.COMMON.PAGE_POSITIVE);
    }

    if (!Number.isFinite(limit) || limit < 1) {
      throwBadRequest(MESSAGES.COMMON.LIMIT_POSITIVE);
    }

    if (order !== "asc" && order !== "desc") {
      throwBadRequest(MESSAGES.COMMON.ORDER_ASC_DESC);
    }

    let normalizedStatus: CourseStatus | undefined = undefined;
    if (status !== undefined) {
      if (typeof status !== "string" || !status.trim()) {
        throwBadRequest(
          MESSAGES.COURSE.STATUS_MUST_BE_ACTIVE_OR_INACTIVE_LOWERCASE
        );
      }
      const trimmed = status.trim() as CourseStatus;
      if (!COURSE_STATUS_VALUES.includes(trimmed)) {
        throwBadRequest(
          MESSAGES.COURSE.STATUS_MUST_BE_ACTIVE_OR_INACTIVE_LOWERCASE
        );
      }
      normalizedStatus = trimmed;
    }

    return this.courseRepository.filter({
      page,
      limit,
      search,
      status: normalizedStatus,
      type,
      sortBy: sortBy ?? "date",
      order,
    });
  }
}
