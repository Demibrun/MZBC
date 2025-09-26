// src/lib/db.ts
import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | null;
}

const uri = process.env.MONGODB_URI;

export async function dbConnect() {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!global.__mongooseConn) {
    // optional: quiet strictQuery warnings
    mongoose.set("strictQuery", false);
    global.__mongooseConn = mongoose
      .connect(uri, {
        // keep defaults sane; SRV string already sets appName, retryWrites, etc.
        maxPoolSize: 10,
      })
      .catch((err) => {
        // reset cache so next call can retry after you fix env
        global.__mongooseConn = null;
        throw err;
      });
  }
  return global.__mongooseConn;
}
