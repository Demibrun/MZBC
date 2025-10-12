import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Unit from "@/lib/models/unit";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// GET /api/workforce/units
export async function GET() {
  try {
    await dbConnect();
    const items = await Unit.find()
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();
    return NextResponse.json({ items });
  } catch (e) {
    console.error("UNITS GET", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/workforce/units  (admin)
export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { name, description = "", joinLink = "", order = 0 } = body || {};
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const created = await Unit.create({
      name,
      description,
      joinLink,
      order: Number(order) || 0,
    });
    return NextResponse.json(created.toObject());
  } catch (e) {
    console.error("UNITS POST", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/workforce/units?id=...  (admin)
export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await Unit.deleteOne({ _id: id }).exec();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("UNITS DELETE", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
