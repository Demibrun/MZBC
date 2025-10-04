export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import DailySection from "@/lib/models/DailySection";
import { requireAdmin } from "../_utils";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section"); // "sundaySchool", etc.

  if (section) {
    const doc = await DailySection.findOne({ key: section }).lean().exec();
    return NextResponse.json({ section: { key: section, items: doc?.items ?? [] } });
  }

  // (optional) full payload for all sections if you need it elsewhere
  const all = await DailySection.find({}).lean().exec();
  return NextResponse.json({ sections: all });
}

export async function PUT(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();

  // payload can be { section:"sundaySchool", item: {...} } to append
  // or { section:"sundaySchool", items:[...] } to replace list entirely
  const body = await req.json();
  const section = String(body.section || "");
  if (!section) {
    return NextResponse.json({ error: "Missing section" }, { status: 400 });
  }

  // append a single item (common case from Admin)
  if (body.item) {
    await DailySection.updateOne(
      { key: section },
      { $push: { items: body.item } },
      { upsert: true }
    ).exec();

    return NextResponse.json({ ok: true });
  }

  // replace all items (less common)
  if (Array.isArray(body.items)) {
    await DailySection.updateOne(
      { key: section },
      { $set: { items: body.items } },
      { upsert: true }
    ).exec();

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}
