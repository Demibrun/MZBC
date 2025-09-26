// src/app/api/workforce/pastors/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Pastor } from "@/lib/models";
import { requireAdmin } from "../../_utils";

export async function GET() {
  await dbConnect();
  const items = await Pastor.find().sort({ order: 1, createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const created = await Pastor.create({
    name: body?.name,
    photoUrl: body?.photoUrl || "",
    order: body?.order || 0,
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

  await Pastor.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}
