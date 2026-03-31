import { Application } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import bannerRoutes from "../routes/admin/banner.routes";
import articleRoutes from "../routes/admin/article.routes";
import categoryRoutes from "../routes/admin/category.routes";
import courseRoutes from "../routes/admin/course.routes";
import galleryRoutes from "../routes/admin/gallery.routes";
import alumniRoutes from "../routes/admin/alumni.routes";
import branchRoutes from "../routes/admin/branch.routes";
import testimonialRoutes from "../routes/admin/testimonial.routes";
import userMgmtRoutes from "../routes/admin/userManagement.routes";
import settingsRoutes from "../routes/admin/settings.routes";
import outreachRoutes from "../routes/admin/outreach.routes";

export function loadAdminRoutes(app: Application): void {
  app.use("/api/admin/banners", authenticateToken, bannerRoutes);
  app.use("/api/admin/articles", authenticateToken, articleRoutes);
  app.use("/api/admin/categories", authenticateToken, categoryRoutes);
  app.use("/api/admin/courses", authenticateToken, courseRoutes);
  app.use("/api/admin/gallery", authenticateToken, galleryRoutes);
  app.use("/api/admin/alumni", authenticateToken, alumniRoutes);
  app.use("/api/admin/branches", authenticateToken, branchRoutes);
  app.use("/api/admin/testimonials", authenticateToken, testimonialRoutes);
  app.use("/api/admin/users", authenticateToken, userMgmtRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/admin/outreach", authenticateToken, outreachRoutes);
}
