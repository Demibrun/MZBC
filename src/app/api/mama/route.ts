// src/app/api/mama/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import mongoose, { Schema } from "mongoose";

/** --- DB connect (inline, no external deps) --- */
const uri = process.env.MONGODB_URI || "";
let conn: typeof mongoose | null = null;
async function dbConnect() {
  if (!uri) throw new Error("MONGODB_URI not set");
  if (conn && mongoose.connection.readyState === 1) return conn;
  if (mongoose.connection.readyState === 1) return mongoose;
  conn = await mongoose.connect(uri);
  return conn;
}

/** --- Minimal model --- */
const MamaSchema = new Schema(
  {
    title: { type: String, default: "" },
    url: { type: String, default: "" },      // original YouTube URL/ID you typed
    videoId: { type: String, required: true } // normalized 11-char ID
  },
  { timestamps: true }
);
const Mama =
  (mongoose.models.Mama as mongoose.Model<any>) ||
  mongoose.model("Mama", MamaSchema);

/** --- Helpers --- */
function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s; // bare ID

  try {
    const u = new URL(s);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean).at(-1);
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "embed");
      if (idx >= 0) {
        const id = parts[idx + 1];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {}
  return null;
}

/** Admin check:
 *  - cookie "mz_admin=1" (your existing admin)
 *  - OR header "x-admin-key: <ADMIN_PASSWORD>"
 */
function isAdmin(req: NextRequest) {
  const cookieAdmin = req.cookies.get("mz_admin")?.value === "1";
  const headerKey = req.headers.get("x-admin-key");
  const envKey = process.env.ADMIN_PASSWORD || "";
  const headerAdmin = !!headerKey && envKey && headerKey === envKey;
  return cookieAdmin || headerAdmin;
}

/** --- GET: list all (public) --- */
export async function GET() {
  try {
    await dbConnect();
    const items = await Mama.find().sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("Mama GET error:", e?.message || e);
    return NextResponse.json({ items: [] });
  }
}

/** --- POST: add one (admin only) --- */
export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { title = "", youtube = "" } = await req.json().catch(() => ({}));
    const videoId = getYouTubeId(youtube);
    if (!videoId) {
      return NextResponse.json(
        { error: "Provide a valid YouTube URL or video ID" },
        { status: 400 }
      );
    }
    await dbConnect();
    const doc = await Mama.create({ title, url: youtube, videoId });
    return NextResponse.json({ ok: true, item: { _id: doc._id, title: doc.title, url: doc.url, videoId: doc.videoId } });
  } catch (e: any) {
    console.error("Mama POST error:", e?.message || e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}

/** --- DELETE: remove by ?id= (admin only) --- */
export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await dbConnect();
    await Mama.deleteOne({ _id: id });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Mama DELETE error:", e?.message || e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
