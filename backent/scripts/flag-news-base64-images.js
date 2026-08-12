/* Read-only audit: flag News (articles) documents whose imageUrl is a base64 data URL.
 * Run with: npm run flag:news-images
 */
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath, quiet: true });

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  "mongodb+srv://admin:12345678aA@cluster0.z8ynxsc.mongodb.net/giridhar-eye-institute";

const COLLECTION = "articles";
const BASE64_PATTERN = /^data:image/i;

async function main() {
  if (!MONGO_URI) {
    console.error("[flag-news-base64-images] Missing MONGO_URI/MONGO_URL in .env.");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  const collection = mongoose.connection.collection(COLLECTION);

  const flagged = await collection
    .find({ imageUrl: { $regex: BASE64_PATTERN } })
    .project({ _id: 1, title: 1, imageUrl: 1 })
    .toArray();

  if (flagged.length === 0) {
    console.log(
      `[flag-news-base64-images] No News documents with a base64 imageUrl found in collection "${COLLECTION}".`
    );
  } else {
    console.log(
      `[flag-news-base64-images] Found ${flagged.length} News document(s) storing a base64 imageUrl:\n`
    );
    for (const doc of flagged) {
      const length = typeof doc.imageUrl === "string" ? doc.imageUrl.length : 0;
      const preview =
        typeof doc.imageUrl === "string" ? doc.imageUrl.slice(0, 60) : "";
      console.log(`- id: ${String(doc._id)}`);
      console.log(`  title: ${String(doc.title ?? "")}`);
      console.log(`  imageUrl length: ${length} chars`);
      console.log(`  imageUrl preview: ${preview}...\n`);
    }
    console.log(
      "These documents must be re-uploaded through the fixed News form (or migrated with a one-time decode script)."
    );
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(
    "[flag-news-base64-images] Failed:",
    err instanceof Error ? err.message : err
  );
  process.exit(1);
});
