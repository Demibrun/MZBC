// src/app/api/daily/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { DailySection } from "@/lib/models";
import { requireAdmin } from "../_utils"; // keep whatever you already use

type DailyItem = {
  _id?: any;
  date?: string;
  title: string;
  subtitle?: string;
  text: string;
};

type DailyDoc = {
  key: "wordOfDay" | "prophetic" | "sundaySchool" | "devotional" | "homecare";
  items: DailyItem[];
};

/* ------------------------- GET ------------------------- */
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") as DailyDoc["key"] | null;

  if (section) {
    const doc = await DailySection
      .findOne({ key: section })
      .lean<DailyDoc | null>();

    return NextResponse.json({
      section: { key: section, items: doc?.items ?? [] },
    });
  }

  // all sections (public page)
  const keys: DailyDoc["key"][] = [
    "wordOfDay",
    "prophetic",
    "sundaySchool",
    "devotional",
    "homecare",
  ];

  const out: Record<string, { key: string; items: DailyItem[] }> = {};
  for (const k of keys) {
    const doc = await DailySection
      .findOne({ key: k })
      .lean<DailyDoc | null>();

    out[k] = { key: k, items: (doc?.items ?? []).slice(0, 50) };
  }

  return NextResponse.json({ sections: out });
}

/* ------------------------- POST (admin) ------------------------- */
// body: { section, entry: { date?, title, subtitle?, text } }
export async function POST(req: NextRequest) {
  await dbConnect();
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { section, entry } = await req.json();
  if (!section || !entry?.title || !entry?.text) {
    return NextResponse.json(
      { error: "Section, title and text are required" },
      { status: 400 }
    );
  }

  const doc =
    (await DailySection.findOne({ key: section })) ||
    (await DailySection.create({ key: section, items: [] }));

  doc.items.unshift({
    date: entry.date,
    title: entry.title,
    subtitle: entry.subtitle,
    text: entry.text,
  } as DailyItem);

  await doc.save();
  return NextResponse.json({ ok: true });
}

/* ------------------------- DELETE (admin) ------------------------- */
// /api/daily?section=wordOfDay&id=xxxxx
export async function DELETE(req: NextRequest) {
  await dbConnect();
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") as DailyDoc["key"] | null;
  const id = searchParams.get("id");

  if (!section || !id) {
    return NextResponse.json(
      { error: "section and id are required" },
      { status: 400 }
    );
  }

  const doc = await DailySection.findOne({ key: section });
  if (!doc) return NextResponse.json({ ok: true });

  doc.items = (doc.items || []).filter((x: any) => String(x._id) !== String(id));
  await doc.save();

  return NextResponse.json({ ok: true });
}
