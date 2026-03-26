"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const banner_routes_1 = __importDefault(require("./routes/banner.routes"));
const article_routes_1 = __importDefault(require("./routes/article.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const enquiry_routes_1 = __importDefault(require("./routes/enquiry.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const gallery_routes_1 = __importDefault(require("./routes/gallery.routes"));
const alumni_routes_1 = __importDefault(require("./routes/alumni.routes"));
const branch_routes_1 = __importDefault(require("./routes/branch.routes"));
const testimonial_routes_1 = __importDefault(require("./routes/testimonial.routes"));
const userManagement_routes_1 = __importDefault(require("./routes/userManagement.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const cors_config_1 = require("./config/cors.config");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const rate_limit_middleware_1 = require("./middlewares/rate-limit.middleware");
const messages_1 = require("./constants/messages");
class AppServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.loadMiddlewares();
        this.loadRoutes();
        this.loadErrorHandling();
    }
    loadMiddlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use(rate_limit_middleware_1.rateLimit);
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
        this.app.use(logger_middleware_1.logRequest);
        this.app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
        this.app.use((0, cors_1.default)(cors_config_1.corsOptions));
        this.app.options(/.*/, (0, cors_1.default)(cors_config_1.corsOptions));
    }
    loadRoutes() {
        this.app.use("/api/auth", auth_routes_1.default);
        this.app.use("/api/enquiries", auth_middleware_1.authenticateToken, enquiry_routes_1.default);
        this.app.use("/api/courses", auth_middleware_1.authenticateToken, course_routes_1.default);
        this.app.use("/api/articles", auth_middleware_1.authenticateToken, article_routes_1.default);
        this.app.use("/api/categories", auth_middleware_1.authenticateToken, category_routes_1.default);
        this.app.use("/api/gallery", auth_middleware_1.authenticateToken, gallery_routes_1.default);
        this.app.use("/api/testimonials", auth_middleware_1.authenticateToken, testimonial_routes_1.default);
        this.app.use("/api/alumni", auth_middleware_1.authenticateToken, alumni_routes_1.default);
        this.app.use("/api/branches", auth_middleware_1.authenticateToken, branch_routes_1.default);
        this.app.use("/api/banners", auth_middleware_1.authenticateToken, banner_routes_1.default);
        this.app.use("/api/users", auth_middleware_1.authenticateToken, userManagement_routes_1.default);
        this.app.use("/api/settings", auth_middleware_1.authenticateToken, settings_routes_1.default);
        this.app.get("/", (_req, res) => {
            res.json({ message: messages_1.MESSAGES.APP.BACKEND_RUNNING });
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
