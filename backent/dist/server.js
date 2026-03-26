"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const mongo_config_1 = require("./config/mongo.config");
dotenv_1.default.config();
dotenv_1.default.config({ path: "src/.env" });
const PORT = Number(process.env.PORT) || 5001;
const startServer = async () => {
    try {
        await (0, mongo_config_1.connectDB)();
        const server = new app_1.default().getServer();
        server.listen(PORT);
        console.log(`Server running on port ${PORT}`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
void startServer();
