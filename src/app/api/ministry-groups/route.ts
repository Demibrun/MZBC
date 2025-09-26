import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MinistryGroup } from "@/lib/models";
import { Types } from "mongoose";

export async function GET(){
  await dbConnect();
  const items = await MinistryGroup.find().sort({ title:1 }).lean();
  return NextResponse.json({ items });
}
export async function POST(req:Request){
  await dbConnect();
  const data = await req.json();
  const doc = await MinistryGroup.findOneAndUpdate(
    { key: data.key }, { $set: data }, { upsert:true, new:true }
  );
  return NextResponse.json(doc);
}
export async function DELETE(req:Request){
  await dbConnect();
  const id = new URL(req.url).searchParams.get("id");
  if(id && Types.ObjectId.isValid(id)) await MinistryGroup.deleteOne({ _id:id });
  return NextResponse.json({ ok:true });
}
