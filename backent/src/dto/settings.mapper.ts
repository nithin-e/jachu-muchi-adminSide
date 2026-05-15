import { GlobalSettingsPayload, SaveSettingsInput } from "../types/settings.types";

export function mapBodyToSaveSettingsInput(
  body: Record<string, unknown>
): SaveSettingsInput {
  const adminEmail =
    typeof body.adminEmail === "string" ? body.adminEmail.trim() : "";

  const userId =
    typeof body.userId === "string" ? body.userId.trim() : undefined;

  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : undefined;

  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : undefined;

  const confirmNewPassword =
    typeof body.confirmNewPassword === "string"
      ? body.confirmNewPassword
      : undefined;

  return {
    adminEmail,
    ...(userId ? { userId } : {}),
    ...(currentPassword !== undefined ? { currentPassword } : {}),
    ...(newPassword !== undefined ? { newPassword } : {}),
    ...(confirmNewPassword !== undefined ? { confirmNewPassword } : {}),
  };
}

export function toPublicSettings(
  doc: GlobalSettingsPayload
): GlobalSettingsPayload {
  return {
    adminEmail: doc.adminEmail,
  };
}
