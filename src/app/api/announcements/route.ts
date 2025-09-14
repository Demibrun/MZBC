import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import { Announcement } from "../../../lib/models";
import { requireAdmin } from "../_utils";

export async function GET(){
  await dbConnect();
  const list = await Announcement.find().sort({ createdAt: -1 });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest){
  const unauthorized = await requireAdmin(); if (unauthorized) return unauthorized;
  await dbConnect();
  const body = await req.json();
  const saved = await Announcement.create({
    ...body,
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    endDate: body.endDate ? new Date(body.endDate) : undefined,
  });
  return NextResponse.json(saved);
}

export async function PUT(req: NextRequest){
  const unauthorized = await requireAdmin(); if (unauthorized) return unauthorized;
  await dbConnect();
  const body = await req.json();
  const { _id, ...data } = body;
  if(!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  const saved = await Announcement.findByIdAndUpdate(_id, {
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  }, { new: true });
  return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest){
  const unauthorized = await requireAdmin(); if (unauthorized) return unauthorized;
  await dbConnect();
  const id = new URL(req.url).searchParams.get("id");
  if(!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await Announcement.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
