const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "";

const isAbsoluteImageUrl = (value: string): boolean =>
  /^https?:\/\//i.test(value) ||
  value.startsWith("data:") ||
  value.startsWith("blob:");

export const getApiBaseUrl = (): string => API_BASE_URL;

export const getImageUrl = (imageUrl?: string, subdir?: string): string => {
  if (!imageUrl) return "";
  if (isAbsoluteImageUrl(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/uploads")) return `${API_BASE_URL}${imageUrl}`;
  return subdir
    ? `${API_BASE_URL}/uploads/${subdir}/${imageUrl}`
    : `${API_BASE_URL}${imageUrl}`;
};
