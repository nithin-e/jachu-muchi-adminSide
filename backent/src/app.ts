import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import authRoutes from "./routes/admin/auth.routes";
import { corsOptions } from "./config/cors.config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logRequest } from "./middlewares/logger.middleware";
import { rateLimit } from "./middlewares/rate-limit.middleware";
import { MESSAGES } from "./constants/messages";
import { loadAdminRoutes } from "./loaders/adminRoutes.loader";
import { loadUserRoutes } from "./loaders/userRoutes.loader";

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

   
    loadAdminRoutes(this.app);  
    loadUserRoutes(this.app);   

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
