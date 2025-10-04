export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import MamaVideo from "@/lib/models/MamaVideo";
import { requireAdmin } from "../_utils"; // <- api/_utils cookie guard

function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  // Already an 11-char ID?
  if (/^[\w-]{11}$/.test(input)) return input.trim();

  try {
    const u = new URL(input);
    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    // youtube.com/watch?v=<id>
    const v = u.searchParams.get("v");
    if (v && /^[\w-]{11}$/.test(v)) return v;
    // youtube.com/embed/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("embed");
    if (idx >= 0 && parts[idx + 1] && /^[\w-]{11}$/.test(parts[idx + 1])) {
      return parts[idx + 1];
    }
  } catch {
    /* ignore */
  }
  return null;
}

// GET: public list
export async function GET() {
  await dbConnect();
  const items = await MamaVideo.find({}).sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

// POST: admin add
export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const title = (body?.title || "").trim();
  const raw = (body?.youtube || "").trim();

  const videoId = extractYouTubeId(raw);
  if (!videoId) {
    return NextResponse.json(
      { error: "Provide a valid YouTube URL or video ID." },
      { status: 400 }
    );
  }

  const doc = await MamaVideo.create({ title, videoId });
  return NextResponse.json({ ok: true, item: { _id: doc._id, title, videoId } });
}

// DELETE: admin remove ?id=<id>
export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await MamaVideo.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}
