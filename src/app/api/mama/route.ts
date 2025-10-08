// Server (Node runtime)
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";         // your mongoose connect helper
import MamaModel from "@/lib/models/MamaModel";   // your Mama schema/model

// tiny helper to extract a youtube ID from url or raw ID
function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
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

// GET /api/mama  -> { items: [{ _id, title, videoId }] }
export async function GET() {
  await dbConnect();
  const docs = await MamaModel.find({}).sort({ _id: -1 }).lean();
  const items = (docs || [])
    .map((d: any) => {
      const videoId =
        getYouTubeId(d.videoId) || getYouTubeId(d.url) || getYouTubeId(d.youtube);
      if (!videoId) return null;
      return { _id: String(d._id), title: d.title || "", videoId };
    })
    .filter(Boolean);
  return NextResponse.json({ items });
}

// POST /api/mama  -> body: { title?: string, youtube: string | id }
export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json().catch(() => ({} as any));
  const videoId =
    getYouTubeId(body.youtube) || getYouTubeId(body.url) || getYouTubeId(body.videoId);
  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube link/ID" }, { status: 400 });
  }
  const doc = await MamaModel.create({ title: body.title || "", videoId });
  return NextResponse.json({ ok: true, item: { _id: String(doc._id), title: doc.title, videoId } });
}

// DELETE /api/mama?id=...
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await MamaModel.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}
