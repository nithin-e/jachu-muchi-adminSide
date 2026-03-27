import mongoose from "mongoose";

export const connectDB = async () => {

  console.log('.....',process.env.MONGO_URL)
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is missing");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MongoDB connection failed:", message);
    process.exit(1);
  }
};
