import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { PrayerPoint } from "@/lib/models";
import { Types } from "mongoose";

export async function GET(){
  await dbConnect();
  const items = await PrayerPoint.find().sort({ createdAt:-1 }).lean();
  return NextResponse.json({ items });
}
export async function POST(req:Request){
  await dbConnect();
  const body = await req.json();
  const created = await PrayerPoint.create({ title: body.title, body: body.body });
  return NextResponse.json(created,{ status:201 });
}
export async function DELETE(req:Request){
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if(id && Types.ObjectId.isValid(id)) await PrayerPoint.deleteOne({ _id:id });
  return NextResponse.json({ ok:true });
}
