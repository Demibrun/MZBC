// Force dynamic so Vercel won’t cache between writes
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import MediaItem from "@/lib/models/MediaItem";
import { requireAdmin } from "@/app/api/_utils/requireAdmin";

// GET /api/media  ->  { items: [...] }
export async function GET() {
  await dbConnect();
  const items = await MediaItem.find().sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items }, {
    // hard no-store; some CDNs can be sticky without this
    headers: { "Cache-Control": "no-store" },
  });
}

// POST /api/media  -> create media (admin only)
export async function POST(req: NextRequest) {
  const notAdmin = await requireAdmin(req);
  if (notAdmin) return notAdmin;

  await dbConnect();
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const { kind, title, url, thumbnail, provider, public_id } = body || {};
  if (!kind || !url) {
    return NextResponse.json({ error: "Missing kind or url" }, { status: 400 });
  }

  const created = await MediaItem.create({
    kind,
    title: title || "",
    url,
    thumbnail: thumbnail || "",
    provider: provider || "cloudinary",
    public_id: public_id || "",
  });

  // return the full object and a simple ok flag
  return NextResponse.json(
    { ok: true, item: created.toObject() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

// DELETE /api/media?id=...
export async function DELETE(req: NextRequest) {
  const notAdmin = await requireAdmin(req);
  if (notAdmin) return notAdmin;

  await dbConnect();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await MediaItem.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
