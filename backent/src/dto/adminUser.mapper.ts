import {
  ADMIN_USER_STATUS_VALUES,
  ADMIN_USER_ROLE_VALUES,
  AdminUserStatus,
} from "../models/User";
import { CreateAdminUserInput, UpdateAdminUserInput } from "../types/adminUser.types";

function normalizeStatus(raw: unknown): AdminUserStatus {
  if (typeof raw !== "string" || !raw.trim()) return "Active";
  const s = raw.trim() as AdminUserStatus;
  return ADMIN_USER_STATUS_VALUES.includes(s) ? s : "Active";
}

function normalizeRole(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "Admin";
  const r = raw.trim();
  return ADMIN_USER_ROLE_VALUES.includes(r as (typeof ADMIN_USER_ROLE_VALUES)[number])
    ? r
    : "Admin";
}

export function mapBodyToCreateAdminUser(
  body: Record<string, unknown>
): CreateAdminUserInput {
  const name =
    (typeof body.name === "string" && body.name) ||
    (typeof body.fullName === "string" && body.fullName) ||
    "";

  const email = typeof body.email === "string" ? body.email.trim() : "";

  const password = typeof body.password === "string" ? body.password : "";

  return {
    name,
    email,
    role: normalizeRole(body.role),
    status: normalizeStatus(body.status),
    password,
  };
}

export function mapBodyToUpdateAdminUser(
  body: Record<string, unknown>
): UpdateAdminUserInput {
  const name =
    (typeof body.name === "string" && body.name) ||
    (typeof body.fullName === "string" && body.fullName) ||
    "";

  const email = typeof body.email === "string" ? body.email.trim() : "";

  const password =
    typeof body.password === "string" && body.password.length > 0
      ? body.password
      : undefined;

  return {
    name,
    email,
    role: normalizeRole(body.role),
    status: normalizeStatus(body.status),
    ...(password !== undefined ? { password } : {}),
  };
}
