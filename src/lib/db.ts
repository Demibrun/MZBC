// src/lib/db.ts
import mongoose from "mongoose";

let _connecting: Promise<typeof mongoose> | null = null;

export async function dbConnect() {
  if (mongoose.connection.readyState === 1) return mongoose; // connected
  if (_connecting) return _connecting;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  _connecting = mongoose.connect(uri, {
    // add options if needed
  });
  try {
    await _connecting;
    return mongoose;
  } finally {
    _connecting = null;
  }
}
