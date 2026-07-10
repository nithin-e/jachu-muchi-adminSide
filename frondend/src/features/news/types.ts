export interface NewsItem {
  id: string;
  title: string;
  description: string;
  details?: string;
  image: string;
  date: string;
  status: "Published" | "Draft";
  author?: string;
  content?: string;
  excerpt?: string;
}
