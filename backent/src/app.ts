import express from "express";
import cors from "cors";
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
import { errorMiddleware } from "./middlewares/error.middleware";
import { MESSAGES } from "./constants/messages";

const app = express();

app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use((req, _res, next) => {
  console.log("----- Incoming Request -----");
  console.log("Method :", req.method);
  console.log("URL    :", req.originalUrl);
  console.log("Time   :", new Date().toLocaleString());
  console.log("Body   :", req.body);
  console.log("----------------------------");
  next();
});

app.use("/api", authRoutes);
app.use("/api", enquiryRoutes);
app.use("/api", courseRoutes);
app.use("/api", articleRoutes);
app.use("/api", categoryRoutes);
app.use("/api", galleryRoutes);
app.use("/api", testimonialRoutes);
app.use("/api", alumniRoutes);
app.use("/api", branchRoutes);
app.use("/api", bannerRoutes);
app.use("/api", userManagementRoutes);
app.use("/api", settingsRoutes);

app.get("/", (_req, res) => {
  res.json({ message: MESSAGES.APP.BACKEND_RUNNING });
});

app.use(errorMiddleware);

export default app;
