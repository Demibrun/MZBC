import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import MinistryGroup from "@/lib/models/ministryGroup";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// GET /api/ministry-groups
export async function GET() {
  try {
    await dbConnect();
    const items = await MinistryGroup.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return NextResponse.json({ items });
  } catch (e) {
    console.error("GROUPS GET", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/ministry-groups  (admin) — upsert-like via create new entries
export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { key, title = "", photoUrl = "", body: text = "" } = body || {};
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const created = await MinistryGroup.create({
      key,
      title,
      photoUrl,
      body: text,
    });
    return NextResponse.json(created.toObject());
  } catch (e) {
    console.error("GROUPS POST", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/ministry-groups?id=...  (admin)
export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await MinistryGroup.deleteOne({ _id: id }).exec();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("GROUPS DELETE", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
