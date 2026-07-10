export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "shipped" | "delivered";

export interface Order {
  id: string;
  customer: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar: string;
}
