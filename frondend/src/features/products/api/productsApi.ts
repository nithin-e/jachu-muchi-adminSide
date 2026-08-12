import { api } from "@lib/apiClient";
import { getImageUrl } from "@lib/imageUrl";
import type { CourseListItem, CoursePayload } from "../types";

export const COURSES_LIST_PATH = "/api/admin/courses/all";
const COURSES_BASE_PATH = "/api/admin/courses";
const courseDetailPath = (id: string) => `${COURSES_BASE_PATH}/${id}`;

type CourseListApiRow = {
  _id: string;
  name?: string;
  title?: string;
  type?: string;
  category?: string;
  duration?: string;
  eligibility?: string;
  keyDetails?: string;
  description?: string;
  status?: boolean | "Active" | "Inactive";
  imageUrl?: string;
  CourseOverview?: string;
};

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);

const isCourseListApiRow = (x: unknown): x is CourseListApiRow =>
  isRecord(x) && typeof x._id === "string" && (typeof x.name === "string" || typeof x.title === "string");

const mapListRowToUi = (item: CourseListApiRow): CourseListItem => ({
  id: item._id,
  courseName: item.name || item.title || "Untitled Course",
  type: item.type || item.category || "General",
  duration: item.duration ?? "",
  eligibility: item.eligibility ?? "",
  courseOverview: (item.CourseOverview || item.keyDetails || item.description) ?? "",
  status:
    item.status === "Active" || item.status === true
      ? "Active"
      : "Inactive",
  image: getImageUrl(item.imageUrl, "courses"),
  priorityOrder: (item as any).priorityOrder ?? null,
});

export const mapCoursesResponse = (data: unknown): CourseListItem[] => {
  if (!isRecord(data)) {
    console.warn("[course.service] Response is not a record:", data);
    return [];
  }

  const nested = data.data;
  const actual = isRecord(nested) ? nested.data : nested;

  if (!Array.isArray(actual)) {
    console.warn("[course.service] Response data is not an array:", actual);
    return [];
  }

  return actual
    .filter((row): row is CourseListApiRow => isCourseListApiRow(row))
    .map(mapListRowToUi);
};

export const getCourses = async (signal?: AbortSignal): Promise<CourseListItem[]> => {
  const res = await api.get<unknown>(COURSES_LIST_PATH, signal ? { signal } : undefined);
  return mapCoursesResponse(res.data);
};

export type CourseFormState = {
  courseName: string;
  type: string;
  duration: string;
  eligibility: string;
  courseOverview: string;
  imageUrl?: string;
};

export const mapCourseDetailToForm = (raw: Record<string, unknown>): CourseFormState => {
  const detail = isRecord(raw.data) ? raw.data : raw;
  return {
    courseName: String(detail.name ?? ""),
    type: String(detail.type ?? ""),
    duration: String(detail.duration ?? ""),
    eligibility: String(detail.eligibility ?? ""),
    courseOverview: String(detail.CourseOverview ?? detail.courseOverview ?? detail.keyDetails ?? ""),
    imageUrl: typeof detail.imageUrl === "string" ? detail.imageUrl : undefined,
  };
};

export const getCourse = async (id: string, signal?: AbortSignal): Promise<CourseFormState> => {
  const res = await api.get<unknown>(courseDetailPath(id), signal ? { signal } : undefined);
  if (isRecord(res.data)) {
    return mapCourseDetailToForm(res.data);
  }
  return {
    courseName: "",
    type: "",
    duration: "",
    eligibility: "",
    courseOverview: "",
  };
};

const toFormData = (data: CoursePayload): FormData => {
  const formData = new FormData();
  const courseName = data.courseName ?? data.title ?? "";
  const CourseOverview = data.CourseOverview ?? data.courseOverview ?? data.body ?? "";

  formData.append("name", courseName);
  formData.append("type", data.type ?? "");
  formData.append("duration", data.duration ?? "");
  formData.append("CourseOverview", CourseOverview);
  formData.append("eligibility", data.eligibility ?? "");
  formData.append("status", data.status ?? "Active");

  if (data.imageFile) {
    formData.append("courseImage", data.imageFile);
  }

  return formData;
};

export const createCourse = async (data: CoursePayload) => {
  const res = await api.post<Record<string, unknown>>(COURSES_BASE_PATH, toFormData(data));
  return res.data;
};

export const updateCourse = async (id: string, data: CoursePayload) => {
  const res = await api.put<Record<string, unknown>>(courseDetailPath(id), toFormData(data));
  return res.data;
};

export const deleteCourse = async (id: string) => {
  const res = await api.delete<unknown>(courseDetailPath(id));
  return res.data;
};

export const setCoursePriority = async (id: string, priorityOrder: number | null) => {
  const res = await api.patch<Record<string, unknown>>(`${COURSES_BASE_PATH}/${id}/priority`, { priorityOrder });
  return res.data;
};

export const getPrioritizedCourses = async (signal?: AbortSignal): Promise<CourseListItem[]> => {
  const res = await api.get<unknown>(`${COURSES_BASE_PATH}/prioritized`, signal ? { signal } : undefined);
  return mapCoursesResponse(res.data);
};
