import {
  ADMIN_USER_ROLE,
  ADMIN_USER_STATUS,
  ADMIN_USER_STATUS_VALUES,
  ADMIN_USER_ROLE_VALUES,
  AdminUserRole,
  AdminUserStatus,
} from "../models/User";
import { CreateAdminUserInput, UpdateAdminUserInput } from "../types/adminUser.types";

function normalizeStatus(raw: unknown): AdminUserStatus {
  if (typeof raw !== "string" || !raw.trim()) return ADMIN_USER_STATUS.ACTIVE;
  const s = raw.trim() as AdminUserStatus;
  return ADMIN_USER_STATUS_VALUES.includes(s) ? s : ADMIN_USER_STATUS.ACTIVE;
}

function normalizeRole(raw: unknown): AdminUserRole {
  if (typeof raw !== "string" || !raw.trim()) return ADMIN_USER_ROLE.ADMIN;
  const r = raw.trim();
  return ADMIN_USER_ROLE_VALUES.includes(r as (typeof ADMIN_USER_ROLE_VALUES)[number])
    ? (r as AdminUserRole)
    : ADMIN_USER_ROLE.ADMIN;
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
