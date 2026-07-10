"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/admin/auth.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const cors_config_1 = require("./config/cors.config");
const error_middleware_1 = require("./middlewares/error.middleware");
const rate_limit_middleware_1 = require("./middlewares/rate-limit.middleware");
const messages_1 = require("./constants/messages");
const adminRoutes_loader_1 = require("./loaders/adminRoutes.loader");
const userRoutes_loader_1 = require("./loaders/userRoutes.loader");
class AppServer {
    constructor() {
        this.app = (0, express_1.default)();
        console.log("🚀 AppServer INIT");
        this.loadMiddlewares();
        this.loadRoutes();
        this.loadErrorHandling();
    }
    loadMiddlewares() {
        // 🔥 GLOBAL API LOGGER
        this.app.use((req, res, next) => {
            console.log("\n====================================");
            console.log(`📌 API HIT`);
            console.log(`METHOD : ${req.method}`);
            console.log(`URL    : ${req.originalUrl}`);
            console.log(`TIME   : ${new Date().toISOString()}`);
            console.log("BODY   :", req.body);
            console.log("PARAMS :", req.params);
            console.log("QUERY  :", req.query);
            res.on("finish", () => {
                console.log(`✅ RESPONSE : ${res.statusCode} ${req.method} ${req.originalUrl}`);
                console.log("====================================\n");
            });
            next();
        });
        this.app.use((0, helmet_1.default)({
            crossOriginResourcePolicy: { policy: "cross-origin" },
            contentSecurityPolicy: false,
        }));
        this.app.use(rate_limit_middleware_1.rateLimit);
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({
            extended: true,
            limit: "10mb",
        }));
        this.app.use((0, cors_1.default)(cors_config_1.corsOptions));
        this.app.options(/.*/, (0, cors_1.default)(cors_config_1.corsOptions));
        this.app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
    }
    loadRoutes() {
        console.log("🔥 LOAD ROUTES STARTED");
        // AUTH ROUTES
        this.app.use("/api/admin/auth", auth_routes_1.default);
        this.app.use("/api/auth/login", auth_routes_1.default);
        this.app.use("/api/auth", auth_routes_1.default);
        // UPLOAD ROUTES
        this.app.use("/api/upload", upload_routes_1.default);
        // DYNAMIC ROUTES
        (0, adminRoutes_loader_1.loadAdminRoutes)(this.app);
        (0, userRoutes_loader_1.loadUserRoutes)(this.app);
        // TEST ROUTE
        this.app.get("/test-route", (_req, res) => {
            res.send("OK - SERVER WORKING");
        });
        // ROOT ROUTE
        this.app.get("/", (_req, res) => {
            res.json({
                message: messages_1.MESSAGES.APP.BACKEND_RUNNING,
            });
        });
        // HEALTH CHECK
        this.app.get("/api/health", (_req, res) => {
            res.json({
                status: "ok",
                timestamp: new Date().toISOString(),
            });
        });
    }
    loadErrorHandling() {
        this.app.use(error_middleware_1.errorMiddleware);
    }
    getServer() {
        return this.app;
    }
}
exports.default = AppServer;
