import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import enquiryRoutes from "./routes/enquiry.routes";
import { corsOptions } from "./config/cors.config";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
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

app.get("/", (_req, res) => {
  res.json({ message: "Backend running 🚀" });
});

app.use(errorMiddleware);

export default app;
