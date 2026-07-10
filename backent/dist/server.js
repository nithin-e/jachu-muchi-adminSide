"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dns_1 = __importDefault(require("dns"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
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
        const { connectDB } = await Promise.resolve().then(() => __importStar(require("./config/mongo.config")));
        await connectDB();
        const { default: AppServer } = await Promise.resolve().then(() => __importStar(require("./app")));
        const app = new AppServer().getServer();
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
};
void startServer();
