import { Route } from "react-router-dom";
import LoginPage from "@features/auth/components/LoginPage";
import ForgotPasswordPage from "@features/auth/components/ForgotPasswordPage";
import ProtectedRoute from "@shared/components/ProtectedRoute";
import AdminLayout from "@shared/components/layout/AdminLayout";
import DashboardPage from "@features/dashboard/components/DashboardPage";
import ProductsPage from "@features/products/components/ProductsPage";
import CourseFormPage from "@features/products/components/CourseFormPage";
import CategoriesPage from "@features/categories/components/CategoriesPage";
import UsersPage from "@features/users/components/UsersPage";
import NewsPage from "@features/news/components/NewsPage";
import NewsFormPage from "@features/news/components/NewsFormPage";
import NewsDetailPage from "@features/news/components/NewsDetailPage";
import EnquiriesPage from "@features/enquiries/components/EnquiriesPage";
import EnquiryDetailPage from "@features/enquiries/components/EnquiryDetailPage";
import BranchesPage from "@features/branches/components/BranchesPage";
import BranchFormPage from "@features/branches/components/BranchFormPage";
import GalleryPage from "@features/gallery/components/GalleryPage";
import GalleryFormPage from "@features/gallery/components/GalleryFormPage";
import BannerPage from "@features/banners/components/BannerPage";
import EditBannerPage from "@features/banners/components/EditBannerPage";
import TestimonialsPage from "@features/testimonials/components/TestimonialsPage";
import TestimonialFormPage from "@features/testimonials/components/TestimonialFormPage";
import AlumniPage from "@features/alumni/components/AlumniPage";
import AlumniFormPage from "@features/alumni/components/AlumniFormPage";
import SettingsPage from "@features/settings/components/SettingsPage";
import SeoPage from "@features/seo/components/SeoPage";
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
      <Route path="gallery/new" element={<GalleryFormPage />} />
      <Route path="gallery/edit/:id" element={<GalleryFormPage />} />
      <Route path="banners" element={<BannerPage />} />
      <Route path="banners/new" element={<EditBannerPage />} />
      <Route path="banners/edit/:id" element={<EditBannerPage />} />
      <Route path="testimonials" element={<TestimonialsPage />} />
      <Route path="testimonials/new" element={<TestimonialFormPage />} />
      <Route path="testimonials/:id/edit" element={<TestimonialFormPage />} />
      <Route path="alumni" element={<AlumniPage />} />
      <Route path="alumni/new" element={<AlumniFormPage />} />
      <Route path="alumni/:id/edit" element={<AlumniFormPage />} />
      <Route path="seo" element={<SeoPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </>
);
