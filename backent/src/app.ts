import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import authRoutes from "./routes/admin/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import { corsOptions } from "./config/cors.config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { rateLimit } from "./middlewares/rate-limit.middleware";
import { MESSAGES } from "./constants/messages";

import { loadAdminRoutes } from "./loaders/adminRoutes.loader";
import { loadUserRoutes } from "./loaders/userRoutes.loader";

class AppServer {
  public app: Application;

  constructor() {
    this.app = express();

    console.log("🚀 AppServer INIT");

    this.loadMiddlewares();
    this.loadRoutes();
    this.loadErrorHandling();
  }

  private loadMiddlewares(): void {

    // 🔥 GLOBAL API LOGGER
    this.app.use((req, res, next) => {
      console.log("\n====================================");
      console.log(`📌 API HIT`);
      console.log(`METHOD : ${req.method}`);
      console.log(`URL    : ${req.originalUrl}`);
      console.log(`TIME   : ${new Date().toISOString()}`);

      console.log("BODY   :", req.body);
      console.log("PARAMS :", req.params);
      console.log("QUERY  :", req.query);

      res.on("finish", () => {
        console.log(
          `✅ RESPONSE : ${res.statusCode} ${req.method} ${req.originalUrl}`
        );
        console.log("====================================\n");
      });

      next();
    });

    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false,
      })
    );

    this.app.use(rateLimit);

    this.app.use(express.json({ limit: "10mb" }));

    this.app.use(
      express.urlencoded({
        extended: true,
        limit: "10mb",
      })
    );

    this.app.use(cors(corsOptions));

    this.app.options(/.*/, cors(corsOptions));

    this.app.use(
      "/uploads",
      express.static(path.join(process.cwd(), "uploads"))
    );
  }

  private loadRoutes(): void {
    console.log("🔥 LOAD ROUTES STARTED");

    // AUTH ROUTES
    this.app.use("/api/admin/auth", authRoutes);
    this.app.use("/api/auth/login", authRoutes);
    this.app.use("/api/auth", authRoutes);

    // UPLOAD ROUTES
    this.app.use("/api/upload", uploadRoutes);

    // DYNAMIC ROUTES
    loadAdminRoutes(this.app);
    loadUserRoutes(this.app);

    // TEST ROUTE
    this.app.get("/test-route", (_req, res) => {
      res.send("OK - SERVER WORKING");
    });

    // ROOT ROUTE
    this.app.get("/", (_req, res) => {
      res.json({
        message: MESSAGES.APP.BACKEND_RUNNING,
      });
    });

    // HEALTH CHECK
    this.app.get("/api/health", (_req, res) => {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
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