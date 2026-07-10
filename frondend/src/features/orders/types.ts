export interface Order {
  id: string;
  customer: string;
  email: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered";
  date: string;
}
