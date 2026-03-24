const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/mongo.config");
const corsOptions = require("./config/cors.config");
const errorMiddleware = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// ✅ Middleware
app.use(express.json());

app.use(
  cors(corsOptions)
);
app.options(/.*/, cors(corsOptions));


app.use((req, res, next)=>{
  console.log("----- Incoming Request -----");
  console.log("Method :", req.method);
  console.log("URL    :", req.originalUrl);
  console.log("Time   :", new Date().toLocaleString());
  console.log("Body   :", req.body);
  console.log("----------------------------");
  next();
})

// ✅ Routes
app.use("/api", authRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

// ✅ Global error middleware
app.use(errorMiddleware);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});