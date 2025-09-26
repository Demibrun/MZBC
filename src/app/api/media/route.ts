import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Media } from "@/models/Media";
import { requireAdmin } from "@/app/api/_utils";

/** GET /api/media -> { items: Media[] } */
export async function GET() {
  await dbConnect();
  const items = await Media.find({}).sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

/** POST /api/media (admin) body: { kind, title?, url, thumbnail? } */
export async function POST(req: Request) {
  const unauth = requireAdmin(req);
  if (unauth) return unauth;

  await dbConnect();

  try {
    const body = await req.json();
    const kind = String(body?.kind || "");
    const url = String(body?.url || "");
    const title = String(body?.title || "");
    const thumbnail = String(body?.thumbnail || "");

    if (!kind || !["youtube", "photo", "audio"].includes(kind)) {
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }
    if (!url) {
      return NextResponse.json({ error: "URL / Video ID required" }, { status: 400 });
    }

    await Media.create({ kind, title, url, thumbnail });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

/** DELETE /api/media?id=... (admin) */
export async function DELETE(req: Request) {
  const unauth = requireAdmin(req);
  if (unauth) return unauth;

  await dbConnect();

  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    await Media.deleteOne({ _id: id }).exec();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
