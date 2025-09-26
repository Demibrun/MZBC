import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { DailySection } from "@/models/DailySection";
import { requireAdmin } from "@/app/api/_utils";

/**
 * GET /api/daily?section=wordOfDay
 * - section present: returns { section: { key, items } }
 * - no section: returns { sections: { [key]: { key, items } } } (each limited to 50)
 */
export async function GET(req: Request) {
  await dbConnect();

  const url = new URL(req.url);
  const section = url.searchParams.get("section") as
    | "wordOfDay"
    | "prophetic"
    | "sundaySchool"
    | "devotional"
    | "homecare"
    | null;

  try {
    if (section) {
      const doc: any =
        (await DailySection.findOne({ key: section }).lean()) || null;

      return NextResponse.json({
        section: {
          key: section,
          items: Array.isArray(doc?.items) ? doc.items.slice(0, 50) : [],
        },
      });
    }

    const keys = ["wordOfDay", "prophetic", "sundaySchool", "devotional", "homecare"];
    const out: Record<string, any> = {};
    for (const k of keys) {
      const doc: any = (await DailySection.findOne({ key: k }).lean()) || null;
      out[k] = { key: k, items: Array.isArray(doc?.items) ? doc.items.slice(0, 50) : [] };
    }
    return NextResponse.json({ sections: out });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/daily
 * body: { section, entry:{ date?, title, subtitle?, text } }
 */
export async function POST(req: Request) {
  const unauth = requireAdmin(req);
  if (unauth) return unauth;

  await dbConnect();

  try {
    const body = await req.json();
    const section = String(body?.section || "");
    const entry = body?.entry ?? {};

    if (!section) {
      return NextResponse.json({ error: "section required" }, { status: 400 });
    }
    if (!entry?.title || !entry?.text) {
      return NextResponse.json({ error: "Title and text are required" }, { status: 400 });
    }

    // Ensure the section doc exists
    let doc = await DailySection.findOne({ key: section });
    if (!doc) {
      doc = new DailySection({ key: section, items: [] });
    }

    // Add item to the start
    doc.items.unshift({
      date: entry.date || undefined,
      title: entry.title,
      subtitle: entry.subtitle || undefined,
      text: entry.text,
    });

    await doc.save();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/daily?section=...&id=...
 */
export async function DELETE(req: Request) {
  const unauth = requireAdmin(req);
  if (unauth) return unauth;

  await dbConnect();

  const url = new URL(req.url);
  const section = url.searchParams.get("section") || "";
  const id = url.searchParams.get("id") || "";

  if (!section || !id) {
    return NextResponse.json({ error: "section and id required" }, { status: 400 });
  }

  try {
    await DailySection.updateOne(
      { key: section },
      { $pull: { items: { _id: id } } }
    ).exec();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
