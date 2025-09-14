// src/lib/db.ts
import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

export async function dbConnect() {
  if (global._mongoose?.conn) return global._mongoose.conn;
  if (!global._mongoose) global._mongoose = { conn: null, promise: null };

  // ⬇️ Read env INSIDE the function (runtime), not at import
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose.connect(uri, { dbName: "mzpmi" }).then((m) => m);
  }
  global._mongoose.conn = await global._mongoose.promise;
  return global._mongoose.conn;
}
