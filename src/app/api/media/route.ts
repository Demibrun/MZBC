// src/app/api/media/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import { requireAdmin } from "../_utils";

export async function GET() {
  await dbConnect();
  const items = await MediaItem.find().sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const { kind, title, url, thumbnail } = body || {};
  if (!kind || !url) {
    return NextResponse.json({ error: "Missing kind or url" }, { status: 400 });
  }

  const created = await MediaItem.create({
    kind,
    title: title || "",
    url,
    thumbnail: thumbnail || "",
  });
  return NextResponse.json(created.toObject());
}

export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await MediaItem.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}
