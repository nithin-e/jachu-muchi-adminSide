
import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    console.error("[MongoDB] Missing MONGO_URI in environment variables.");
    console.error("[MongoDB] Add MONGO_URI to backend root .env and restart the server.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MongoDB connection failed:", message);
    return false;
  }
};