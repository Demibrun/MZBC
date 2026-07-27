// src/app/api/home/sermon/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import mongoose, { Schema, models } from "mongoose";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "../../_utils";

const Sermon: mongoose.Model<any> =
  (models.Sermon as mongoose.Model<any>) ||
  mongoose.model<any>(
    "Sermon",
    new Schema(
      {
        heroHeadline: { type: String, default: "" },
        heroSub: { type: String, default: "" },
      },
      { timestamps: true }
    )
  );

export async function GET() {
  await dbConnect();
  const doc = await Sermon.findOne({}).lean().exec();
  return NextResponse.json({ item: doc || { heroHeadline: "", heroSub: "" } });
}

export async function PUT(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const { heroHeadline = "", heroSub = "" } = body || {};

  await Sermon.updateOne(
    {},
    { $set: { heroHeadline, heroSub } },
    { upsert: true }
  ).exec();

  return NextResponse.json({ ok: true });
}
