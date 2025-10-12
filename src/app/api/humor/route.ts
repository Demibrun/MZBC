import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Humor from "@/lib/models/humor";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

/** GET /api/humor */
export async function GET() {
  try {
    await dbConnect();
    const item = await Humor.findOne().lean().exec();
    return NextResponse.json({ item: item || {} });
  } catch (e: any) {
    console.error("HUMOR GET", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PUT /api/humor (admin) — upsert single doc */
export async function PUT(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { humor = "", scienceFact = "", healthFact = "" } = body || {};

    const updated = await Humor.findOneAndUpdate(
      {},
      { humor, scienceFact, healthFact },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("HUMOR PUT", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
