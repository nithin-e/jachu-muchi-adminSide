"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const mongo_config_1 = require("./config/mongo.config");
const envPath = path_1.default.resolve(process.cwd(), ".env");
const envResult = dotenv_1.default.config({ path: envPath, quiet: true });
if (envResult.error) {
    console.error(`[ENV] Could not load environment file at ${envPath}`);
    console.error("[ENV] Please create a .env file in the backend root folder.");
}
else {
    console.log(`[ENV] Loaded environment variables from ${envPath}`);
}
console.log(`[ENV] Mongo URI available: ${Boolean(process.env.MONGO_URI || process.env.MONGO_URL)}`);
const dnsServers = (process.env.DNS_SERVERS || "")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
if (dnsServers.length > 0) {
    dns_1.default.setServers(dnsServers);
    console.log(`[ENV] Using custom DNS servers: ${dnsServers.join(", ")}`);
}
const PORT = Number(process.env.PORT) || 5001;
const startServer = async () => {
    try {
        await (0, mongo_config_1.connectDB)();
        const app = new app_1.default().getServer();
        const httpServer = http_1.default.createServer(app);
        httpServer.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`[EADDRINUSE] Port ${PORT} is already in use. Another Node/backend may still be running (check other terminals), or stop the process: Get-NetTCPConnection -LocalPort ${PORT} | Select OwningProcess; taskkill /PID <pid> /F`);
            }
            else {
                console.error(err);
            }
            process.exit(1);
        });
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
    const server = new app_1.default().getServer();
    server.listen(PORT);
    console.log(`Server running on port ${PORT}`);
};
void startServer();
