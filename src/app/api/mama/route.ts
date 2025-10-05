// src/app/api/mama/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import mongoose, { Schema, models } from "mongoose";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "../_utils";

function toYoutubeId(input: string): string {
  if (!input) return "";
  try {
    if (input.startsWith("http")) {
      const u = new URL(input);
      // standard watch?v=
      const v = u.searchParams.get("v");
      if (v) return v;
      // youtu.be/ID
      const last = u.pathname.split("/").filter(Boolean).pop() || "";
      return last;
    }
    return input; // already an ID
  } catch {
    return input;
  }
}

const MamaSchema = new Schema(
  {
    title: String,
    videoId: { type: String, required: true },
  },
  { timestamps: true }
);

const Mama =
  models.MamaVideo || mongoose.model("MamaVideo", MamaSchema);

// GET list
export async function GET() {
  await dbConnect();
  const items = await Mama.find({}).sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

// POST add (Admin)
export async function POST(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json().catch(() => ({}));
  const title = body?.title || "";
  const youtube = body?.youtube || "";
  const videoId = toYoutubeId(youtube);

  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL/ID" }, { status: 400 });
  }

  const doc = await Mama.create({ title, videoId });
  return NextResponse.json({ ok: true, id: String(doc._id) });
}

// DELETE (Admin)
export async function DELETE(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await Mama.deleteOne({ _id: new mongoose.Types.ObjectId(id) }).exec();
  return NextResponse.json({ ok: true });
}
