export type GalleryCategory = "Campus" | "Labs" | "Events";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  url?: string;
}
