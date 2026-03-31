import { Application } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import enquiryRoutes from "../routes/user/enquiry.routes";
import courseRoutes from "../routes/user/course.routes";
import alumniRoutes from "../routes/user/alumni.routes";

export function loadUserRoutes(app: Application): void {

//   app.use("/api/courses", courseRoutes);
//   app.use("/api/alumni", alumniRoutes);

  // Authenticated user routes
  app.use("/api/enquiries", enquiryRoutes);
}
