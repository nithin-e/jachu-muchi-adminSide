import dotenv from "dotenv";
import dns from "dns";
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
  const isDbConnected = await connectDB();

  if (!isDbConnected) {
    console.error("[Server] Startup halted due to database configuration/connection error.");
    return;
  }

  const server = new AppServer().getServer();
  server.listen(PORT);
  console.log(`Server running on port ${PORT}`);
};


void startServer();
