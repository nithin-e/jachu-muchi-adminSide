import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../types/testimonial.types";
import { TestimonialStatus } from "../models/Testimonial";

export function mapBodyToCreateTestimonialInput(
  body: Record<string, unknown>,
  avatarUrlFromFile?: string
): CreateTestimonialInput {
  const name =
    (typeof body.name === "string" && body.name) || "";

  const role =
    typeof body.role === "string" && body.role.trim()
      ? body.role.trim()
      : undefined;

  const content =
    (typeof body.content === "string" && body.content) ||
    (typeof body.message === "string" && body.message) ||
    "";

  const statusRaw =
    typeof body.status === "string" && body.status.trim()
      ? body.status.trim()
      : "";
  const status: TestimonialStatus =
    statusRaw === "Active" || statusRaw === "Inactive" ? statusRaw : "Active";

  const explicitUrl =
    typeof body.avatarUrl === "string" && body.avatarUrl.trim()
      ? body.avatarUrl.trim()
      : typeof body.profileImageUrl === "string" && body.profileImageUrl.trim()
        ? body.profileImageUrl.trim()
        : undefined;

  return {
    name,
    status,
    content,
    ...(role ? { role } : {}),
    ...(avatarUrlFromFile
      ? { avatarUrl: avatarUrlFromFile }
      : explicitUrl
        ? { avatarUrl: explicitUrl }
        : {}),
  };
}

export function mapBodyToUpdateTestimonialInput(
  body: Record<string, unknown>,
  avatarUrlFromFile?: string
): UpdateTestimonialInput {
  return mapBodyToCreateTestimonialInput(
    body,
    avatarUrlFromFile
  ) as UpdateTestimonialInput;
}
