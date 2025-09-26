import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Unit } from "@/lib/models";
import { Types } from "mongoose";

export async function GET(){
  await dbConnect();
  const items = await Unit.find().sort({ order:1, createdAt:1 }).lean();
  return NextResponse.json({ items });
}
export async function POST(req:Request){
  await dbConnect();
  const body = await req.json();
  const created = await Unit.create(body);
  return NextResponse.json(created,{ status:201 });
}
export async function DELETE(req:Request){
  await dbConnect();
  const id = new URL(req.url).searchParams.get("id");
  if(id && Types.ObjectId.isValid(id)) await Unit.deleteOne({ _id:id });
  return NextResponse.json({ ok:true });
}
