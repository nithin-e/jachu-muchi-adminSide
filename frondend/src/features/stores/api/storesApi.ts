import { api } from "@lib/apiClient";

export const STORES_PATH = "/api/admin/stores";
export const storeDetailPath = (id: string) => `${STORES_PATH}/${id}`;

export type StoreListItem = {
  id: string;
  name: string;
  description: string;
  images: string[];
  status: "Active" | "Inactive";
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  zip?: string;
  image?: string;
};

export type StoreFormData = {
  name: string;
  description: string;
  status: "Active" | "Inactive";
  address?: string;
  phone?: string;
  email?: string;
  imageFiles?: File[];
  existingImages?: string[];
  city?: string;
  state?: string;
  zip?: string;
  image?: string;
};

const getApiBaseUrl = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return "";
};

const toAbsoluteImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (/^data:/.test(imageUrl)) return imageUrl;
  if (/^blob:/.test(imageUrl)) return imageUrl;

  const apiBase = getApiBaseUrl();

  return imageUrl.startsWith("/uploads")
    ? `${apiBase}${imageUrl}`
    : `${apiBase}/uploads/stores/${imageUrl}`;
};

const rowToStoreItem = (raw: Record<string, unknown>): StoreListItem => {
  const rawImages = raw.images;
  const images: string[] = Array.isArray(rawImages)
    ? rawImages.map((img: string) => toAbsoluteImageUrl(img))
    : [];

  return {
    id: String(raw._id ?? raw.id ?? ""),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    images,
    status:
      raw.status === "Active" || raw.status === "Inactive"
        ? (raw.status as "Active" | "Inactive")
        : "Active",
    address: typeof raw.address === "string" ? raw.address : undefined,
    city: typeof raw.city === "string" ? raw.city : undefined,
    state: typeof raw.state === "string" ? raw.state : undefined,
    zip: typeof raw.zip === "string" ? raw.zip : undefined,
    phone: typeof raw.phone === "string" ? raw.phone : undefined,
    email: typeof raw.email === "string" ? raw.email : undefined,
    image: typeof raw.image === "string" ? raw.image : undefined,
  };
};

export const getStores = async (signal?: AbortSignal): Promise<StoreListItem[]> => {
  const res = await api.get<unknown>(
    `${STORES_PATH}/all`,
    signal ? { signal } : undefined,
  );
  const data = (res.data as any)?.data;
  if (!Array.isArray(data)) return [];
  return data.map((item: any) => rowToStoreItem(item as Record<string, unknown>));
};

export const getStoreById = async (id: string): Promise<StoreListItem | null> => {
  try {
    const res = await api.get<unknown>(storeDetailPath(id));
    const data = (res.data as any)?.data ?? res.data;
    if (data && typeof data === "object") {
      return rowToStoreItem(data as Record<string, unknown>);
    }
    return null;
  } catch {
    return null;
  }
};

const toFormData = (data: StoreFormData): FormData => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("status", data.status);
  if (data.address) formData.append("address", data.address);
  if (data.phone) formData.append("phone", data.phone);
  if (data.email) formData.append("email", data.email);

  if (data.imageFiles) {
    for (const file of data.imageFiles) {
      formData.append("images", file);
    }
  }

  return formData;
};

export const createStore = async (data: StoreFormData): Promise<StoreListItem> => {
  const formData = toFormData(data);
  const res = await api.post<Record<string, unknown>>(STORES_PATH, formData);
  const responseData = (res.data as any)?.data ?? res.data;
  return rowToStoreItem(responseData as Record<string, unknown>);
};

export const updateStore = async (id: string, data: StoreFormData): Promise<StoreListItem> => {
  const formData = toFormData(data);
  const res = await api.put<Record<string, unknown>>(storeDetailPath(id), formData);
  const responseData = (res.data as any)?.data ?? res.data;
  return rowToStoreItem(responseData as Record<string, unknown>);
};

export const deleteStore = async (id: string): Promise<void> => {
  await api.delete(storeDetailPath(id));
};
