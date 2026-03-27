import dotenv from "dotenv";
import http from "http";
import AppServer from "./app";
import { connectDB } from "./config/mongo.config";

dotenv.config();
dotenv.config({ path: "src/.env" });

const PORT = Number(process.env.PORT) || 5001;

const startServer = async () => {
  try {
    await connectDB();
    const app = new AppServer().getServer();
    const httpServer = http.createServer(app);

    httpServer.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `[EADDRINUSE] Port ${PORT} is already in use. Another Node/backend may still be running (check other terminals), or stop the process: Get-NetTCPConnection -LocalPort ${PORT} | Select OwningProcess; taskkill /PID <pid> /F`
        );
      } else {
        console.error(err);
      }
      process.exit(1);
    });

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void startServer();
