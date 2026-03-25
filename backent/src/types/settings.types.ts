export interface GlobalSettingsPayload {
  whatsAppNumber: string;
  adminEmail: string;
  notificationEmails: string[];
}

export interface SaveSettingsInput extends GlobalSettingsPayload {
  /** When changing password, identify the logged-in admin user. */
  userId?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
