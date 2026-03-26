import dotenv from "dotenv";
import AppServer from "./app";
import { connectDB } from "./config/mongo.config";

dotenv.config();
dotenv.config({ path: "src/.env" });

const PORT = Number(process.env.PORT) || 5001;

const startServer = async () => {
  try {
    await connectDB();
    const server = new AppServer().getServer();
    server.listen(PORT);
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void startServer();
