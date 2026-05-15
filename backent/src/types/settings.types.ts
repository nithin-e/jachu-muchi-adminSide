export interface GlobalSettingsPayload {
  adminEmail: string;
}

export interface SaveSettingsInput {
  adminEmail: string;
  /** When changing password, identify the logged-in admin user. */
  userId?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface UpdateAdminEmailInput {
  adminEmail: string;
  userId: string;
}

export interface UpdateNotificationEmailsInput {
  notificationEmails: string[];
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  userId: string;
}
