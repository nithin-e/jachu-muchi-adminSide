export interface AdminSettings {
  adminEmail: string;
  notificationEmails: { id: string; email: string }[];
}

export type SaveSettingsInput = {
  adminEmail: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
}
