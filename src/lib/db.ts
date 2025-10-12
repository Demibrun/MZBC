// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
let conn: typeof mongoose | null = null;

export async function dbConnect() {
  if (conn) return conn;
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
  conn = await mongoose.connect(MONGODB_URI);
  return conn;
}

// Optional: keep default too so both import styles work
export default dbConnect;
