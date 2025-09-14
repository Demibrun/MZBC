import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env");

declare global {
  // eslint-disable-next-line no-var
  var _mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

export async function dbConnect() {
  if (global._mongoose?.conn) return global._mongoose.conn;
  if (!global._mongoose) global._mongoose = { conn: null, promise: null };
  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose.connect(MONGODB_URI, { dbName: "mzpmi" });
  }
  global._mongoose.conn = await global._mongoose.promise;
  return global._mongoose.conn;
}
