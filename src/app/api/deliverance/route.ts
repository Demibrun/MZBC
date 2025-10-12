import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Deliverance from "@/lib/models/deliverance";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

/** GET /api/deliverance */
export async function GET() {
  try {
    await dbConnect();
    const item = await Deliverance.findOne().lean().exec();
    return NextResponse.json({ item: item || {} });
  } catch (e: any) {
    console.error("DELIV GET", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PUT /api/deliverance (admin) — upsert single doc */
export async function PUT(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const {
      zoomId = "",
      zoomPasscode = "",
      instructions = "",
    } = body || {};

    const updated = await Deliverance.findOneAndUpdate(
      {},
      { zoomId, zoomPasscode, instructions },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("DELIV PUT", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
