// src/app/api/deliverance/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import DeliveranceModel from "@/lib/models/deliverance";
import { requireAdmin } from "../_utils";

export async function GET() {
  await dbConnect();
  const item = await DeliveranceModel.findOne({}).lean().exec();
  return NextResponse.json({ item: item ?? {} });
}

export async function PUT(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  await DeliveranceModel.updateOne({}, { $set: body }, { upsert: true }).exec();
  return NextResponse.json({ ok: true });
}
