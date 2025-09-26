// src/app/api/daily/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { DailySection } from "@/lib/models";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

/**
 * GET:
 *  - /api/daily?section=wordOfDay -> single section (up to 50 items)
 *  - /api/daily                   -> all sections
 */
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  if (section) {
    const doc: any = (await DailySection.findOne({ key: section }).lean()) || null;
    return NextResponse.json({
      section: {
        key: section,
        items: Array.isArray(doc?.items) ? doc.items.slice(0, 50) : [],
      },
    });
  }

  const keys = ["wordOfDay", "prophetic", "sundaySchool", "devotional", "homecare"] as const;
  const out: Record<string, any> = {};

  for (const k of keys) {
    const doc: any = await DailySection.findOne({ key: k }).lean();
    out[k] = { key: k, items: Array.isArray(doc?.items) ? doc.items.slice(0, 50) : [] };
  }

  return NextResponse.json({ sections: out });
}

/**
 * POST (admin):
 * body: { section, entry: { date?, title, subtitle?, text } }
 */
export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  await dbConnect();

  const body = await req.json().catch(() => null);
  const section = body?.section as
    | "wordOfDay" | "prophetic" | "sundaySchool" | "devotional" | "homecare";
  const entry = body?.entry as { date?: string; title?: string; subtitle?: string; text?: string } | undefined;

  if (!section || !entry?.title || !entry?.text) {
    return NextResponse.json({ error: "Title and text are required" }, { status: 400 });
  }

  const doc: any =
    (await DailySection.findOne({ key: section })) ||
    new (DailySection as any)({ key: section, items: [] });

  const newItem = {
    date: entry.date || null,
    title: entry.title!,
    subtitle: entry.subtitle || null,
    text: entry.text!,
  };

  doc.items = [newItem, ...(Array.isArray(doc.items) ? doc.items : [])].slice(0, 500);
  await doc.save();

  return NextResponse.json({ ok: true });
}

/**
 * DELETE (admin):
 * /api/daily?section=wordOfDay&id=<item_id>
 */
export async function DELETE(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const id = searchParams.get("id");

  if (!section || !id) {
    return NextResponse.json({ error: "Missing section or id" }, { status: 400 });
  }

  const doc: any = await DailySection.findOne({ key: section });
  if (!doc) return NextResponse.json({ ok: true });

  doc.items = (Array.isArray(doc.items) ? doc.items : []).filter(
    (x: any) => String(x?._id) !== String(id)
  );
  await doc.save();

  return NextResponse.json({ ok: true });
}
