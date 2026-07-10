import { Route } from "react-router-dom";
import LoginPage from "@features/auth/components/LoginPage";
import ForgotPasswordPage from "@features/auth/components/ForgotPasswordPage";
import ProtectedRoute from "@shared/components/ProtectedRoute";
import AdminLayout from "@shared/components/layout/AdminLayout";
import DashboardPage from "@features/dashboard/components/DashboardPage";
import ProductsPage from "@features/products/components/ProductsPage";
import CourseFormPage from "@features/products/components/CourseFormPage";
import CategoriesPage from "@features/categories/components/CategoriesPage";
import OrdersPage from "@features/orders/components/OrdersPage";
import StorePage from "@features/stores/components/StorePage";
import StoreFormPage from "@features/stores/components/StoreFormPage";
import UsersPage from "@features/users/components/UsersPage";
import NewsPage from "@features/news/components/NewsPage";
import NewsFormPage from "@features/news/components/NewsFormPage";
import NewsDetailPage from "@features/news/components/NewsDetailPage";
import EnquiriesPage from "@features/enquiries/components/EnquiriesPage";
import EnquiryDetailPage from "@features/enquiries/components/EnquiryDetailPage";
import BranchesPage from "@features/branches/components/BranchesPage";
import BranchFormPage from "@features/branches/components/BranchFormPage";
import GalleryPage from "@features/gallery/components/GalleryPage";
import BannerPage from "@features/banners/components/BannerPage";
import EditBannerPage from "@features/banners/components/EditBannerPage";
import TestimonialsPage from "@features/testimonials/components/TestimonialsPage";
import TestimonialFormPage from "@features/testimonials/components/TestimonialFormPage";
import AlumniPage from "@features/alumni/components/AlumniPage";
import AlumniFormPage from "@features/alumni/components/AlumniFormPage";
import SettingsPage from "@features/settings/components/SettingsPage";
import NotFound from "@shared/components/NotFound";

export const AppRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<DashboardPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="courses/new" element={<CourseFormPage />} />
      <Route path="courses/edit/:id" element={<CourseFormPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="stores" element={<StorePage />} />
      <Route path="stores/new" element={<StoreFormPage />} />
      <Route path="stores/edit/:id" element={<StoreFormPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="news" element={<NewsPage />} />
      <Route path="news/new" element={<NewsFormPage />} />
      <Route path="news/edit/:id" element={<NewsFormPage />} />
      <Route path="news/:id" element={<NewsDetailPage />} />
      <Route path="enquiries" element={<EnquiriesPage />} />
      <Route path="enquiries/:id" element={<EnquiryDetailPage />} />
      <Route path="branches" element={<BranchesPage />} />
      <Route path="branches/new" element={<BranchFormPage />} />
      <Route path="branches/edit/:id" element={<BranchFormPage />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="banners" element={<BannerPage />} />
      <Route path="banners/edit/:id" element={<EditBannerPage />} />
      <Route path="testimonials" element={<TestimonialsPage />} />
      <Route path="testimonials/add" element={<TestimonialFormPage />} />
      <Route path="testimonials/edit/:id" element={<TestimonialFormPage />} />
      <Route path="alumni" element={<AlumniPage />} />
      <Route path="alumni/add" element={<AlumniFormPage />} />
      <Route path="alumni/edit/:id" element={<AlumniFormPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </>
);
