import { api } from "@lib/apiClient";
import type { DashboardStats } from "@shared/types";

interface DashboardApiResponse {
  totalUsers: number;
  totalOrders: number;
  totalEnquiries: number;
  revenue: number;
  recentEnquiries: { name: string; email: string; status: string }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardApiResponse>("/dashboard/stats");
  return {
    totalProducts: 0,
    totalOrders: response.data.totalOrders,
    totalUsers: response.data.totalUsers,
    totalRevenue: response.data.revenue,
  };
};
