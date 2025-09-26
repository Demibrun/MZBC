// test-conn.mjs
import mongoose from "mongoose";
const uri = process.env.MONGODB_URI || "mongodb+srv://mzbc_user:Mzbc2025Site@mzbc-cluster.roxmac9.mongodb.net/?retryWrites=true&w=majority&appName=mzbc-cluster";
try {
  await mongoose.connect(uri, { dbName: "mzpmi" });
  console.log("✅ Connected to MongoDB");
  process.exit(0);
} catch (e) {
  console.error("❌ Mongo connect failed:", e.message);
  process.exit(1);
}
