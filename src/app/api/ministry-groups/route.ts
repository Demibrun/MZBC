// src/app/api/ministry-groups/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MinistryGroup } from "@/lib/models";
import { requireAdmin } from "../_utils";

export async function GET() {
  await dbConnect();
  const items = await MinistryGroup.find().sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

// upsert by "key"
export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const { key, title, photoUrl, body: text } = body || {};
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  await MinistryGroup.updateOne(
    { key },
    { $set: { title: title || "", photoUrl: photoUrl || "", body: text || "" } },
    { upsert: true }
  ).exec();

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await MinistryGroup.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}
