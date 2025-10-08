export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import MamaModel from "@/lib/models/MamaModel";
import { requireAdmin } from "../_utils"; // adjust the ../ depth to match your tree

// same helper style you used elsewhere
function deriveYouTubeId(input: string): string {
  const s = (input || "").trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean).at(-1) || "";
      if (/^[\w-]{11}$/.test(id)) return id;
    }
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const i = parts.findIndex((p) => p === "embed");
      if (i >= 0 && /^[\w-]{11}$/.test(parts[i + 1] || "")) return parts[i + 1]!;
    }
  } catch {}
  // fallback to raw; front-end will still try to embed
  return s;
}

// GET — public (like Media)
export async function GET() {
  await dbConnect();
  const items = await MamaModel.find({}).sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

// POST — admin only (like Media)
export async function POST(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const title: string = body?.title || "";
  const youtube: string = body?.youtube || body?.url || "";

  if (!youtube) {
    return NextResponse.json({ error: "YouTube URL or ID required" }, { status: 400 });
  }

  const videoId = deriveYouTubeId(youtube);
  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL/ID" }, { status: 400 });
  }

  await MamaModel.create({ title, url: youtube, videoId });
  return NextResponse.json({ ok: true });
}

// DELETE — admin only (like Media)
export async function DELETE(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await MamaModel.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}
