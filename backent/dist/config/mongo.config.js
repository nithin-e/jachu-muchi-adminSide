"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!mongoUri) {
        console.error("[MongoDB] Missing MONGO_URI in environment variables.");
        console.error("[MongoDB] Add MONGO_URI to backend root .env and restart the server.");
        return false;
    }
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log("MongoDB connected successfully");
        return true;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("MongoDB connection failed:", message);
        return false;
    }
};
exports.connectDB = connectDB;
