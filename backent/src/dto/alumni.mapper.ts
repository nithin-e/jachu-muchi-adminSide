import { CreateAlumniInput, UpdateAlumniInput } from "../types/alumni.types";

export function mapBodyToCreateAlumniInput(
  body: Record<string, unknown>,
  profileImageUrl?: string
): CreateAlumniInput {
  const name =
    (typeof body.name === "string" && body.name) ||
    (typeof body.fullName === "string" && body.fullName) ||
    "";

  const role =
    (typeof body.role === "string" && body.role) ||
    (typeof body.designation === "string" && body.designation) ||
    (typeof body.jobTitle === "string" && body.jobTitle) ||
    "";

  const company =
    (typeof body.company === "string" && body.company) ||
    (typeof body.employer === "string" && body.employer) ||
    "";

  const place =
    (typeof body.place === "string" && body.place) ||
    (typeof body.city === "string" && body.city) ||
    (typeof body.location === "string" && body.location) ||
    "";

  const explicitUrl =
    typeof body.profileImageUrl === "string" ? body.profileImageUrl : undefined;

  return {
    name,
    role,
    company,
    place,
    ...(profileImageUrl
      ? { profileImageUrl }
      : explicitUrl?.trim()
        ? { profileImageUrl: explicitUrl.trim() }
        : {}),
  };
}

export function mapBodyToUpdateAlumniInput(
  body: Record<string, unknown>,
  profileImageUrl?: string
): UpdateAlumniInput {
  return mapBodyToCreateAlumniInput(body, profileImageUrl) as UpdateAlumniInput;
}
