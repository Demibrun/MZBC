// src/app/api/daily/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { DailySection } from "@/lib/models";
import { requireAdmin } from "../_utils";

/**
 * GET:
 *  - /api/daily?section=wordOfDay|prophetic|sundaySchool|devotional|homecare
 *  - If no section given, returns all sections (each with items[])
 */
export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  if (section) {
    const doc =
      (await DailySection.findOne({ key: section }).lean().exec()) || null;
    return NextResponse.json({
      section: {
        key: section,
        items: doc?.items || [],
      },
    });
  }

  // all sections
  const keys = ["wordOfDay", "prophetic", "sundaySchool", "devotional", "homecare"] as const;
  const docs = await DailySection.find({ key: { $in: keys } }).lean().exec();
  const byKey = Object.fromEntries(docs.map((d: any) => [d.key, d]));
  return NextResponse.json({
    sections: {
      wordOfDay: { items: byKey["wordOfDay"]?.items || [] },
      prophetic: { items: byKey["prophetic"]?.items || [] },
      sundaySchool: { items: byKey["sundaySchool"]?.items || [] },
      devotional: { items: byKey["devotional"]?.items || [] },
      homecare: { items: byKey["homecare"]?.items || [] },
    },
  });
}

/**
 * POST (admin): add entry to a section
 * body: { section: "wordOfDay"|"prophetic"|..., entry: { date?, title, subtitle?, text } }
 */
export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const section = body?.section;
  const entry = body?.entry;

  if (!section || !entry?.title || !entry?.text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const doc =
    (await DailySection.findOne({ key: section }).exec()) ||
    (await DailySection.create({ key: section, items: [] }));

  // newest on top
  doc.items.unshift({
    date: entry.date || "",
    title: entry.title,
    subtitle: entry.subtitle || "",
    text: entry.text,
  });

  await doc.save();
  return NextResponse.json({ ok: true });
}

/**
 * DELETE (admin): remove one entry by id from a section
 *  /api/daily?section=...&id=...
 */
export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const id = searchParams.get("id");

  if (!section || !id) {
    return NextResponse.json({ error: "Missing section or id" }, { status: 400 });
  }

  const doc = await DailySection.findOne({ key: section }).exec();
  if (!doc) return NextResponse.json({ ok: true }); // nothing to delete

  doc.items = doc.items.filter((x: any) => String(x._id) !== String(id));
  await doc.save();

  return NextResponse.json({ ok: true });
}
