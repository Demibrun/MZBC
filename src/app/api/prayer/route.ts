import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import PrayerPoint from "@/lib/models/prayerPoint";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

/** GET /api/prayer */
export async function GET() {
  try {
    await dbConnect();
    const items = await PrayerPoint.find().sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("PRAYER GET", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST /api/prayer (admin) */
export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { title, body: content } = body || {};
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const created = await PrayerPoint.create({ title, body: content });
    return NextResponse.json(created.toObject());
  } catch (e: any) {
    console.error("PRAYER POST", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE /api/prayer?id=... (admin) */
export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await PrayerPoint.deleteOne({ _id: id }).exec();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("PRAYER DELETE", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
