// src/app/api/daily/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import mongoose, { Schema, models } from "mongoose";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "../_utils"; // <-- keep this path as in your project

type SectionKey = "wordOfDay" | "prophetic" | "sundaySchool" | "devotional" | "homecare";

const EntrySchema = new Schema(
  {
    date: String,
    title: { type: String, required: true },
    subtitle: String,
    text: { type: String, required: true },

    // Only used for sundaySchool
    mediaKind: { type: String, enum: ["youtube", "audio", "video", null], default: null },
    mediaUrl: String,
    mediaTitle: String,
    thumbnail: String,
  },
  { _id: true, timestamps: true }
);

const DailySchema = new Schema(
  {
    wordOfDay: { items: { type: [EntrySchema], default: [] } },
    prophetic: { items: { type: [EntrySchema], default: [] } },
    sundaySchool: { items: { type: [EntrySchema], default: [] } },
    devotional: { items: { type: [EntrySchema], default: [] } },
    homecare: { items: { type: [EntrySchema], default: [] } },
  },
  { timestamps: true }
);

const Daily =
  models.Daily || mongoose.model("Daily", DailySchema);

/** GET
 *  - /api/daily?section=wordOfDay -> { section: { items: [...] } }
 *  - /api/daily (no section) -> { sections: { wordOfDay: {items}, ... } }
 */
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") as SectionKey | null;

  const doc = await Daily.findOne({}).lean().exec();

  // nothing in DB yet → return empty structure that UI can handle
  const empty = {
    wordOfDay: { items: [] as any[] },
    prophetic: { items: [] as any[] },
    sundaySchool: { items: [] as any[] },
    devotional: { items: [] as any[] },
    homecare: { items: [] as any[] },
  };

  const base = doc || empty;

  if (section) {
    const pick = (base as any)[section] || { items: [] };
    return NextResponse.json({ section: pick });
  }

  return NextResponse.json({ sections: base });
}

/** POST  (Admin)
 * Body: { section: SectionKey, entry: Entry }
 * Pushes new entry to top of chosen section.
 */
export async function POST(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json().catch(() => ({}));
  const section = (body?.section || "") as SectionKey;
  const entry = body?.entry || null;

  const valid: SectionKey[] = [
    "wordOfDay",
    "prophetic",
    "sundaySchool",
    "devotional",
    "homecare",
  ];
  if (!valid.includes(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  if (!entry?.title || !entry?.text) {
    return NextResponse.json({ error: "title and text are required" }, { status: 400 });
  }

  // Only sundaySchool accepts media props
  if (section !== "sundaySchool") {
    delete entry.mediaKind;
    delete entry.mediaUrl;
    delete entry.mediaTitle;
    delete entry.thumbnail;
  }

  await Daily.updateOne(
    {},
    {
      $push: {
        [`${section}.items`]: {
          $each: [entry],
          $position: 0, // push to top
        },
      },
    },
    { upsert: true }
  ).exec();

  return NextResponse.json({ ok: true });
}

/** DELETE  (Admin)
 * /api/daily?section=...&id=...
 * Removes an entry by _id from a section.
 */
export async function DELETE(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") as SectionKey | null;
  const id = searchParams.get("id");

  if (!section || !id) {
    return NextResponse.json({ error: "section and id required" }, { status: 400 });
  }

  await Daily.updateOne(
    {},
    { $pull: { [`${section}.items`]: { _id: new mongoose.Types.ObjectId(id) } } }
  ).exec();

  return NextResponse.json({ ok: true });
}
