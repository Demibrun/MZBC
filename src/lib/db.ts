// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "mzpmi";
let conn: typeof mongoose | null = null;

export async function dbConnect() {
  if (conn) return conn;
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
  conn = await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  return conn;
}

// Optional: keep default too so both import styles work
export default dbConnect;
