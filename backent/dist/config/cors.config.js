"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const allowedOrigins = [
    "https://demo.vtrustinstitutions.com",
    "http://demo.vtrustinstitutions.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174"
];
exports.corsOptions = {
    origin: (origin, callback) => {
        // ✅ Allow server-to-server / curl / pm2 / health checks
        if (!origin)
            return callback(null, true);
        // ✅ Normalize origin (REMOVE trailing slash)
        const normalizedOrigin = origin.replace(/\/$/, "");
        const isAllowed = allowedOrigins.some((allowed) => normalizedOrigin === allowed);
        if (isAllowed) {
            return callback(null, true);
        }
        console.log("❌ BLOCKED CORS:", origin);
        // ❗ DO NOT THROW ERROR (this is your main bug)
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
