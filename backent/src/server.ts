import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/mongo.config";

dotenv.config({ quiet: true });
dotenv.config({ path: "src/.env", quiet: true });

const PORT = Number(process.env.PORT) || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
