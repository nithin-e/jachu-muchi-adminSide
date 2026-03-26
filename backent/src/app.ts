import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import authRoutes from "./routes/auth.routes";
import bannerRoutes from "./routes/banner.routes";
import articleRoutes from "./routes/article.routes";
import categoryRoutes from "./routes/category.routes";
import enquiryRoutes from "./routes/enquiry.routes";
import courseRoutes from "./routes/course.routes";
import galleryRoutes from "./routes/gallery.routes";
import alumniRoutes from "./routes/alumni.routes";
import branchRoutes from "./routes/branch.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import userManagementRoutes from "./routes/userManagement.routes";
import settingsRoutes from "./routes/settings.routes";
import { corsOptions } from "./config/cors.config";
import { authenticateToken } from "./middlewares/auth.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logRequest } from "./middlewares/logger.middleware";
import { rateLimit } from "./middlewares/rate-limit.middleware";
import { MESSAGES } from "./constants/messages";

class AppServer {
  public app: Application;

  constructor() {
    this.app = express();
    this.loadMiddlewares();
    this.loadRoutes();
    this.loadErrorHandling();
  }

  private loadMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(rateLimit);
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(logRequest);
    this.app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
    this.app.use(cors(corsOptions));
    this.app.options(/.*/, cors(corsOptions));
  }

  private loadRoutes(): void {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/enquiries", authenticateToken, enquiryRoutes);
    this.app.use("/api/courses", authenticateToken, courseRoutes);
    this.app.use("/api/articles", authenticateToken, articleRoutes);
    this.app.use("/api/categories", authenticateToken, categoryRoutes);
    this.app.use("/api/gallery", authenticateToken, galleryRoutes);
    this.app.use("/api/testimonials", authenticateToken, testimonialRoutes);
    this.app.use("/api/alumni", authenticateToken, alumniRoutes);
    this.app.use("/api/branches", authenticateToken, branchRoutes);
    this.app.use("/api/banners", authenticateToken, bannerRoutes);
    this.app.use("/api/users", authenticateToken, userManagementRoutes);
    this.app.use("/api/settings", authenticateToken, settingsRoutes);

    this.app.get("/", (_req, res) => {
      res.json({ message: MESSAGES.APP.BACKEND_RUNNING });
    });
  }

  private loadErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public getServer(): Application {
    return this.app;
  }
}

export default AppServer;
