import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import MediaItem from "@/lib/models/MediaItem";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  await dbConnect();
  const items = await MediaItem.find().sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const notAdmin = requireAdmin(req);     // <-- pass req
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json().catch(() => ({}));
  const { kind, title, url, thumbnail, provider, public_id } = body || {};
  if (!kind || !url) {
    return NextResponse.json({ error: "Missing kind or url" }, { status: 400 });
  }

  const created = await MediaItem.create({
    kind,
    title: title || "",
    url,
    thumbnail: thumbnail || "",
    provider: provider || "",
    public_id: public_id || "",
  });
  return NextResponse.json(created.toObject());
}

export async function DELETE(req: NextRequest) {
  const notAdmin = requireAdmin(req);     // <-- pass req
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await MediaItem.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}
