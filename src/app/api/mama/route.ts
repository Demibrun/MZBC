// src/app/api/mama/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import mongoose, { Schema, models } from "mongoose";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "../_utils"; // adjust path to your utils

const Mama =
  models.Mama ||
  mongoose.model(
    "Mama",
    new Schema(
      {
        title: String,
        // can store either a videoId OR a raw youtube URL; we’ll normalize on read
        videoId: String,
        url: String,
      },
      { timestamps: true }
    )
  );

// GET: public
export async function GET() {
  await dbConnect();
  const items = await Mama.find({}).lean().exec();
  return NextResponse.json({ items });
}

// POST: admin only
export async function POST(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const { title, youtube } = body || {}; // youtube: either full URL or ID
  if (!youtube) {
    return NextResponse.json({ error: "YouTube URL or ID required" }, { status: 400 });
  }

  // store both raw and derived ID (optional)
  const videoId = deriveYouTubeId(youtube);
  await Mama.create({ title: title || "", videoId, url: youtube });
  return NextResponse.json({ ok: true });
}

// DELETE: admin only
export async function DELETE(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await Mama.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}

function deriveYouTubeId(input: string): string {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.split("/").filter(Boolean).at(-1) || s;
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "embed");
      if (idx >= 0) return parts[idx + 1] || s;
    }
  } catch {}
  return s;
}
