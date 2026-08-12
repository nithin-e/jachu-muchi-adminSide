import { api, isApiRequestError } from "@lib/apiClient";
import { getImageUrl } from "@lib/imageUrl";

export type GalleryCategory = "Campus" | "Labs" | "Events";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
}

const GALLERY_PATH = "/api/admin/gallery";
const JP_FALLBACK_PATH = "/api/admin/photos";
export const galleryItemPath = (id: string) => `${GALLERY_PATH}/${id}`;

type JsonPlaceholderPhoto = {
  id: number;
  albumId: number;
  title: string;
  url: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isGalleryCategory = (value: unknown): value is GalleryCategory =>
  value === "Campus" || value === "Labs" || value === "Events";

const isJpPhoto = (x: unknown): x is JsonPlaceholderPhoto =>
  isRecord(x) &&
  typeof x.id === "number" &&
  typeof x.url === "string" &&
  typeof x.title === "string" &&
  typeof x.albumId === "number";

const isGalleryRow = (x: unknown): x is GalleryItem =>
  isRecord(x) &&
  (typeof x.id === "string" || typeof x.id === "number") &&
  typeof x.title === "string" &&
  isGalleryCategory(x.category) &&
  typeof (x.image ?? x.url) === "string";

const albumIdToCategory = (albumId: number): GalleryCategory => {
  const m = albumId % 3;
  if (m === 0) return "Campus";
  if (m === 1) return "Labs";
  return "Events";
};

const mapPhotoToItem = (p: JsonPlaceholderPhoto): GalleryItem => ({
  id: String(p.id),
  title: p.title || `Photo ${p.id}`,
  category: albumIdToCategory(p.albumId),
  image: getImageUrl(p.url, "gallery"),
});

const rowToGalleryItem = (raw: Record<string, unknown>): GalleryItem => {
  const category = isGalleryCategory(raw.category) ? raw.category : "Campus";
  const rawUrl = String(raw.image ?? raw.imageUrl ?? raw.url ?? "");
  return {
    id: String(raw.id ?? raw._id ?? ""),
    title: String(raw.title ?? ""),
    category,
    image: getImageUrl(rawUrl, "gallery"),
  };
};

const isDataUrl = (value: string): boolean => value.startsWith("data:");

const dataUrlToFile = (dataUrl: string): File | null => {
  const match = dataUrl.match(/^data:([^;,]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], `gallery.${ext}`, { type: mime });
};

const buildGalleryFormData = (payload: Omit<GalleryItem, "id">): FormData => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("category", payload.category);
  if (isDataUrl(payload.image)) {
    const file = dataUrlToFile(payload.image);
    if (file) formData.append("galleryImage", file);
  }
  return formData;
};

const shouldFallbackToJsonPlaceholder = (err: unknown): boolean => {
  return isApiRequestError(err) && err.status === 404;
};

const normalizeGalleryItems = (data: unknown): GalleryItem[] => {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (data.every((item) => isGalleryRow(item))) {
    return data;
  }
  if (data.every((item) => isJpPhoto(item))) {
    return data.map(mapPhotoToItem);
  }
  return data
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => (isJpPhoto(item) ? mapPhotoToItem(item) : rowToGalleryItem(item)));
};

export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const tryGet = async (path: string) =>
    api.get<unknown>(`${path}/all?_limit=30`);

  let res;
  try {
    res = await tryGet(GALLERY_PATH);
  } catch (e) {
    if (!shouldFallbackToJsonPlaceholder(e)) throw e;
    res = await tryGet(JP_FALLBACK_PATH);
  }

  const body = isRecord(res.data) ? res.data : {};
  const actualData = body.data ?? res.data;

  return normalizeGalleryItems(actualData);
};

export const getGalleryItemById = async (id: string): Promise<GalleryItem | null> => {
  try {
    const res = await api.get<unknown>(galleryItemPath(id));
    const row =
      isRecord(res.data) && isRecord(res.data.data) ? res.data.data : res.data;
    if (row && typeof row === "object") {
      return rowToGalleryItem(row as Record<string, unknown>);
    }
    return null;
  } catch {
    return null;
  }
};

export const createGalleryItem = async (
  payload: Omit<GalleryItem, "id">,
): Promise<GalleryItem> => {
  const res = await api.post<Record<string, unknown>>(GALLERY_PATH, buildGalleryFormData(payload));

  const responseData = isRecord(res.data) ? res.data : {};
  const data = isRecord(responseData.data) ? responseData.data : responseData;
  const id = data._id != null ? String(data._id) : data.id != null ? String(data.id) : Date.now().toString();
  const returnImage =
    typeof data.imageUrl === "string"
      ? data.imageUrl
      : typeof data.image === "string"
        ? data.image
        : payload.image;
  return {
    id,
    title: payload.title,
    category: payload.category,
    image: getImageUrl(returnImage, "gallery"),
  };
};

export const updateGalleryItem = async (
  id: string,
  payload: Omit<GalleryItem, "id">,
): Promise<void> => {
  await api.put(galleryItemPath(id), buildGalleryFormData(payload));
};

export const deleteGalleryItemApi = async (id: string): Promise<void> => {
  try {
    await api.delete(galleryItemPath(id));
  } catch (e) {
    if (shouldFallbackToJsonPlaceholder(e)) {
      await api.delete(`${JP_FALLBACK_PATH}/${id}`);
      return;
    }
    throw e;
  }
};
