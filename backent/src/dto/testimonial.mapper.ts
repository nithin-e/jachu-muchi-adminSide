import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../types/testimonial.types";

export function mapBodyToCreateTestimonialInput(
  body: Record<string, unknown>,
  profileImageUrl?: string
): CreateTestimonialInput {
  const name =
    (typeof body.name === "string" && body.name) ||
    (typeof body.studentName === "string" && body.studentName) ||
    "";

  const course =
    (typeof body.course === "string" && body.course) ||
    (typeof body.courseName === "string" && body.courseName) ||
    "";

  const message =
    (typeof body.message === "string" && body.message) ||
    (typeof body.content === "string" && body.content) ||
    "";

  const explicitUrl =
    typeof body.profileImageUrl === "string" ? body.profileImageUrl : undefined;

  return {
    name,
    course,
    message,
    ...(profileImageUrl
      ? { profileImageUrl }
      : explicitUrl?.trim()
        ? { profileImageUrl: explicitUrl.trim() }
        : {}),
  };
}

export function mapBodyToUpdateTestimonialInput(
  body: Record<string, unknown>,
  profileImageUrl?: string
): UpdateTestimonialInput {
  return mapBodyToCreateTestimonialInput(
    body,
    profileImageUrl
  ) as UpdateTestimonialInput;
}
