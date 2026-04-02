import { Application } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import enquiryRoutes from "../routes/user/enquiry.routes";
import courseRoutes from "../routes/user/course.routes";
import alumniRoutes from "../routes/user/alumni.routes";
import outreachRouter from "../routes/user/outreachRoutes";
import galleryRouter from "../routes/user/gallery.route";
import testimonialRouter from "../routes/user/testimonial.routes";
import bannerRouter from "../routes/user/banner.routes";
import articleRouter from "../routes/user/article.routes";
import categoryRouter from "../routes/user/category.routes";
import BranchRouter from "../routes/user/branch.routes";

export function loadUserRoutes(app: Application): void {
  app.use("/api/courses", courseRoutes);
  app.use("/api/alumni", alumniRoutes);
  app.use("/api/enquiry", outreachRouter); 
  app.use("/api/enquiries", enquiryRoutes);
  app.use("/api/gallery", galleryRouter);
  app.use("/api/testimonials", testimonialRouter);
  app.use("/api/banners", bannerRouter);
  app.use("/api/articles", articleRouter);
  app.use("/api/categories", categoryRouter);
  app.use("/api/admin/branches", BranchRouter);
  
}
