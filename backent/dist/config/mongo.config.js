"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    console.log('.....', process.env.MONGO_URL);
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is missing");
        }
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("MongoDB connection failed:", message);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
