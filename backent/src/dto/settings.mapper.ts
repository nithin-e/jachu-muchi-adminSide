import { GlobalSettingsPayload, SaveSettingsInput } from "../types/settings.types";

function parseNotificationEmails(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((x): x is string => typeof x === "string")
      .map((e) => e.trim())
      .filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((x): x is string => typeof x === "string")
          .map((e) => e.trim())
          .filter(Boolean);
      }
    } catch {
      return raw
        .split(/[,;]/)
        .map((e) => e.trim())
        .filter(Boolean);
    }
  }
  return [];
}

export function mapBodyToSaveSettingsInput(
  body: Record<string, unknown>
): SaveSettingsInput {
  const whatsAppNumber =
    typeof body.whatsAppNumber === "string"
      ? body.whatsAppNumber.trim()
      : typeof body.whatsappNumber === "string"
        ? body.whatsappNumber.trim()
        : "";

  const adminEmail =
    typeof body.adminEmail === "string" ? body.adminEmail.trim() : "";

  const notificationEmails = parseNotificationEmails(
    body.notificationEmails ?? body.notificationEmailList
  );

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
    whatsAppNumber,
    adminEmail,
    notificationEmails,
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
    whatsAppNumber: doc.whatsAppNumber,
    adminEmail: doc.adminEmail,
    notificationEmails: [...doc.notificationEmails],
  };
}
