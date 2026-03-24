"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const enquiry_routes_1 = __importDefault(require("./routes/enquiry.routes"));
const cors_config_1 = require("./config/cors.config");
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_config_1.corsOptions));
app.options(/.*/, (0, cors_1.default)(cors_config_1.corsOptions));
app.use((req, _res, next) => {
    console.log("----- Incoming Request -----");
    console.log("Method :", req.method);
    console.log("URL    :", req.originalUrl);
    console.log("Time   :", new Date().toLocaleString());
    console.log("Body   :", req.body);
    console.log("----------------------------");
    next();
});
app.use("/api", auth_routes_1.default);
app.use("/api", enquiry_routes_1.default);
app.get("/", (_req, res) => {
    res.json({ message: "Backend running 🚀" });
});
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
