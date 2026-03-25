import { NextFunction, Request, Response } from "express";
import path from "path";
import { CreateCourseInput, UpdateCourseInput } from "../types/course.types";
import { ICourseService } from "../services/interfaces/ICourseService";
import { courseUploadPublicPath } from "../config/multer.course";
import {
  COURSE_STATUS_VALUES,
  CourseModel,
  CourseStatus,
  ICourseDocument,
} from "../models/Course";
import { StatusCode } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

function mapBodyToCreateInput(
  body: Record<string, unknown>,
  imageUrl?: string
): CreateCourseInput {
  const name =
    (typeof body.courseName === "string" && body.courseName) ||
    (typeof body.name === "string" && body.name) ||
    "";

  const type =
    (typeof body.courseType === "string" && body.courseType) ||
    (typeof body.type === "string" && body.type) ||
    "";

  const duration =
    typeof body.duration === "string" ? body.duration : "";

  const keyDetails =
    (typeof body.keyDetails === "string" && body.keyDetails) ||
    (typeof body.details === "string" && body.details) ||
    "";

  const eligibility =
    typeof body.eligibility === "string" ? body.eligibility : "";

  const statusCandidate =
    (typeof body.status === "string" && body.status) ||
    (typeof body.courseStatus === "string" && body.courseStatus) ||
    undefined;

  const status: CourseStatus | undefined =
    statusCandidate && COURSE_STATUS_VALUES.includes(statusCandidate as CourseStatus)
      ? (statusCandidate as CourseStatus)
      : undefined;

  const explicitUrl =
    typeof body.imageUrl === "string" ? body.imageUrl : undefined;

  return {
    name,
    type,
    duration,
    keyDetails,
    eligibility,
    ...(status !== undefined ? { status } : {}),
    ...(imageUrl
      ? { imageUrl }
      : explicitUrl?.trim()
        ? { imageUrl: explicitUrl.trim() }
        : {}),
  };
}

export class CourseController {
  constructor(private readonly courseService: ICourseService) {}

  /**
   * Initial-load endpoint: returns all courses with details, no pagination.
   * GET /api/courses/all
   */
  listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data: ICourseDocument[] = await CourseModel.find()
        .sort({ createdAt: -1 })
        .lean();

      return res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Filtering endpoint: search + pagination + sorting + filtering.
   * GET /api/courses/filter
   */
  filterCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query as Record<string, unknown>;

      const pageRaw = query.page;
      const limitRaw = query.limit;
      const searchRaw = query.search;
      const statusRaw = query.status;
      const typeRaw = query.type;
      const sortByRaw = query.sortBy;
      const orderRaw = query.order;

      const page =
        typeof pageRaw === "string" && pageRaw.trim()
          ? Number(pageRaw)
          : 1;
      const limit =
        typeof limitRaw === "string" && limitRaw.trim()
          ? Number(limitRaw)
          : 10;

      const search =
        typeof searchRaw === "string" && searchRaw.trim()
          ? searchRaw
          : undefined;

      const status =
        typeof statusRaw === "string" && statusRaw.trim()
          ? statusRaw
          : undefined;

      const type =
        typeof typeRaw === "string" && typeRaw.trim()
          ? typeRaw
          : undefined;

      const sortBy =
        typeof sortByRaw === "string" && sortByRaw.trim()
          ? sortByRaw
          : "createdAt";

      const order =
        typeof orderRaw === "string" && orderRaw.trim()
          ? (orderRaw === "asc" ? "asc" : "desc")
          : "desc";

      const result = await this.courseService.filterCourses({
        page,
        limit,
        search,
        status,
        type,
        sortBy,
        order,
      });

      return res.status(StatusCode.OK).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.COURSE.ID_REQUIRED,
        });
      }

      const file = req.file;
      let imageUrl: string | undefined;

      if (file?.filename) {
        imageUrl = `${courseUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const body = mapBodyToCreateInput(
        req.body as Record<string, unknown>,
        imageUrl
      ) as UpdateCourseInput;

      const course = await this.courseService.updateCourse(id, body);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.COURSE.UPDATED_SUCCESS,
        data: course,
      });
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.COURSE.ID_REQUIRED,
        });
      }

      await this.courseService.deleteCourse(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.COURSE.DELETED_SUCCESS,
      });
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      let imageUrl: string | undefined;

      if (file?.filename) {
        imageUrl = `${courseUploadPublicPath}/${path.basename(file.filename)}`;
      }

      const payload = mapBodyToCreateInput(
        req.body as Record<string, unknown>,
        imageUrl
      );

      const course = await this.courseService.createCourse(payload);

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: MESSAGES.COURSE.CREATED_SUCCESS,
        data: course,
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /courses/:id/image — multipart field `courseImage` (PNG/JPG).
   */
  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.COURSE.ID_REQUIRED,
        });
      }

      const file = req.file;
      if (!file?.filename) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.COURSE.IMAGE_FILE_REQUIRED_COURSE_IMAGE,
        });
      }

      const imageUrl = `${courseUploadPublicPath}/${path.basename(file.filename)}`;
      const course = await this.courseService.uploadCourseImage(id, imageUrl);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.COURSE.IMAGE_UPLOADED_SUCCESS,
        data: course,
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * DELETE /courses/:id/image — removes image only; course row stays.
   */
  deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.COURSE.ID_REQUIRED,
        });
      }

      const course = await this.courseService.removeCourseImage(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.COURSE.IMAGE_REMOVED_SUCCESS,
        data: course,
      });
    } catch (error) {
      return next(error);
    }
  };
}
