export interface NewsItem {
  id: string;
  title: string;
  description: string;
  details: string;
  articleDate: string;
  status: "Published" | "Draft";
  imageUrl: string;
}
