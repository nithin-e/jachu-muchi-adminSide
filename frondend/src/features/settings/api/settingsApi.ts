import { api } from "@lib/apiClient";
import type { AdminSettings, SaveSettingsInput } from "../types";

export const SETTINGS_GET_PATH = "/api/admin/settings/";
export const SETTINGS_SAVE_PATH = "/api/admin/settings/";
export const ADD_NOTIFICATION_EMAIL_PATH = "/api/admin/settings/notification-emails";
export const DELETE_NOTIFICATION_EMAIL_PATH = (id: string) => `/api/admin/settings/notification-emails/${id}`;
export const UPDATE_ADMIN_EMAIL_PATH = "/api/admin/settings/email";
export const UPDATE_NOTIFICATION_EMAILS_PATH = "/api/admin/settings/notifications";
export const UPDATE_PASSWORD_PATH = "/api/admin/settings/password";

export const defaultAdminSettings: AdminSettings = {
  adminEmail: "",
  notificationEmails: [],
};

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);

const parseEmailsFromUsername = (username: unknown): { id: string; email: string }[] => {
  if (typeof username !== "string") return [];
  const list = username
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.map((e, i) => ({ id: `dummy-${i}`, email: e }));
};

const parseSettingsResponse = (raw: Record<string, unknown>): AdminSettings => {
  const body = isRecord(raw.data) ? raw.data : raw;

  if ("adminEmail" in body && Array.isArray(body.notificationEmails)) {
    const emails = (body.notificationEmails as unknown[])
      .map((item) => {
        if (typeof item === "string") return { id: "", email: item };
        if (isRecord(item) && typeof item.email === "string") {
          return { id: String(item.id ?? ""), email: item.email };
        }
        return null;
      })
      .filter(Boolean) as { id: string; email: string }[];

    return {
      adminEmail: String(body.adminEmail),
      notificationEmails: emails,
    };
  }

  if (
    "Admin_email" in body &&
    Array.isArray(body.Notification_emails)
  ) {
    const emails = (body.Notification_emails as unknown[]).map((e, i) => ({
      id: `fallback-${i}`,
      email: String(e),
    }));
    return {
      adminEmail: String(body.Admin_email),
      notificationEmails: emails,
    };
  }

  const notificationEmails =
    Array.isArray(body.notificationEmails) && body.notificationEmails.length
      ? (body.notificationEmails as unknown[]).map((e, i) => ({ id: `dummy-${i}`, email: String(e) }))
      : Array.isArray(body.Notification_emails) && body.Notification_emails.length
        ? (body.Notification_emails as unknown[]).map((e, i) => ({ id: `fallback-${i}`, email: String(e) }))
        : parseEmailsFromUsername(body.username);

  return {
    adminEmail: String(body.email ?? body.Admin_email ?? body.adminEmail ?? defaultAdminSettings.adminEmail),
    notificationEmails: notificationEmails.length
      ? notificationEmails
      : [...defaultAdminSettings.notificationEmails],
  };
};

export const toSettingsSavePayload = (
  payload: SaveSettingsInput,
): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    adminEmail: payload.adminEmail.trim(),
  };

  if (payload.currentPassword?.trim()) body.currentPassword = payload.currentPassword.trim();
  if (payload.newPassword?.trim()) body.newPassword = payload.newPassword.trim();
  if (payload.confirmNewPassword?.trim()) body.confirmNewPassword = payload.confirmNewPassword.trim();

  return body;
};

export const getSettings = async (signal?: AbortSignal): Promise<AdminSettings> => {
  const res = await api.get<unknown>(
    SETTINGS_GET_PATH,
    signal ? { signal } : undefined,
  );

  const data = res.data;
  if (isRecord(data)) return parseSettingsResponse(data);

  console.warn(
    "[settings.service] Unexpected GET settings response shape. Using defaults.",
    data,
  );
  return { ...defaultAdminSettings };
};

export const saveSettings = async (payload: SaveSettingsInput): Promise<void> => {
  await api.put(SETTINGS_SAVE_PATH, toSettingsSavePayload(payload));
};

export const addNotificationEmail = async (email: string): Promise<{ id: string; email: string }> => {
  const res = await api.post<{ data: { id: string; email: string } }>(ADD_NOTIFICATION_EMAIL_PATH, { email });
  return res.data.data;
};

export const deleteNotificationEmail = async (id: string): Promise<void> => {
  await api.delete<void>(DELETE_NOTIFICATION_EMAIL_PATH(id));
};

export const updateAdminEmail = async (adminEmail: string): Promise<void> => {
  await api.put(UPDATE_ADMIN_EMAIL_PATH, { adminEmail });
};

export const updateNotificationEmails = async (notificationEmails: string[]): Promise<{ id: string; email: string }[]> => {
  const res = await api.put<{ data: { notificationEmails: { id: string; email: string }[] } }>(
    UPDATE_NOTIFICATION_EMAILS_PATH,
    { notificationEmails },
  );
  return res.data.data.notificationEmails;
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await api.put(UPDATE_PASSWORD_PATH, { currentPassword, newPassword });
};
