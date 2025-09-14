import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import { Service } from "../../../lib/models";
import { requireAdmin } from "../_utils";

export async function GET(){ await dbConnect(); const list = await Service.find().sort({ order:1 }); return NextResponse.json(list); }

export async function POST(req: NextRequest){
  const unauthorized = await requireAdmin(); if (unauthorized) return unauthorized;
  await dbConnect();
  const body = await req.json();
  const saved = await Service.create(body);
  return NextResponse.json(saved);
}

export async function PUT(req: NextRequest){
  const unauthorized = await requireAdmin(); if (unauthorized) return unauthorized;
  await dbConnect();
  const body = await req.json();
  const { _id, ...data } = body;
  if(!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  const saved = await Service.findByIdAndUpdate(_id, data, { new: true });
  return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest){
  const unauthorized = await requireAdmin(); if (unauthorized) return unauthorized;
  await dbConnect();
  const id = new URL(req.url).searchParams.get("id");
  if(!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await Service.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
