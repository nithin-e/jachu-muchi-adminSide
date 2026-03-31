import dotenv from "dotenv";
import dns from "dns";
import http from "http";
import path from "path";
import AppServer from "./app";
import { connectDB } from "./config/mongo.config";

const envPath = path.resolve(process.cwd(), ".env");
const envResult = dotenv.config({ path: envPath, quiet: true });

if (envResult.error) {
  console.error(`[ENV] Could not load environment file at ${envPath}`);
  console.error("[ENV] Please create a .env file in the backend root folder.");
} else {
  console.log(`[ENV] Loaded environment variables from ${envPath}`);
}

console.log(
  `[ENV] Mongo URI available: ${Boolean(process.env.MONGO_URI || process.env.MONGO_URL)}`
);

const dnsServers = (process.env.DNS_SERVERS || "")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
  console.log(`[ENV] Using custom DNS servers: ${dnsServers.join(", ")}`);
}

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