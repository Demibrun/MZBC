// src/app/api/humor/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Humor } from "@/lib/models";
import { requireAdmin } from "../_utils";

export async function GET() {
  await dbConnect();
  const item = await Humor.findOne({}).lean().exec();
  return NextResponse.json({ item: item || {} });
}

export async function PUT(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  await Humor.updateOne({}, { $set: body }, { upsert: true }).exec();
  return NextResponse.json({ ok: true });
}
