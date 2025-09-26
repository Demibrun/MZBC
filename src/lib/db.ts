import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI env var");
}

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
let cached: Cached = (global as any)._mongooseCached || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB || undefined,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  (global as any)._mongooseCached = cached;
  return cached.conn;
}
