import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Testimony from "@/lib/models/testimony";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

/** GET /api/testimonies?all=1
 * all=1 -> return all
 * otherwise -> return approved only
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "1";

    const q = showAll ? {} : { approved: true };
    const items = await Testimony.find(q).sort({ createdAt: -1 }).lean().exec();

    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("TESTIMONIES GET", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST /api/testimonies (admin) */
export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { title, name = "", body: content, approved = true } = body || {};

    if (!title || !content) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    const created = await Testimony.create({
      title,
      name,
      body: content,
      approved: !!approved,
    });

    return NextResponse.json(created.toObject());
  } catch (e: any) {
    console.error("TESTIMONIES POST", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE /api/testimonies?id=... (admin) */
export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await Testimony.deleteOne({ _id: id }).exec();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("TESTIMONIES DELETE", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
