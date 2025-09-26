// src/app/api/prayer/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { PrayerPoint } from "@/lib/models";
import { requireAdmin } from "../_utils";

export async function GET() {
  await dbConnect();
  const items = await PrayerPoint.find().sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const { title, body: content } = body || {};
  if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const created = await PrayerPoint.create({ title, body: content });
  return NextResponse.json(created.toObject());
}

export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await PrayerPoint.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}
