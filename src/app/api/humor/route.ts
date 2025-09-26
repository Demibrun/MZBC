import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Humor } from "@/lib/models";

export async function GET(){
  await dbConnect();
  const item = await Humor.findOne().sort({ createdAt:-1 }).lean();
  return NextResponse.json({ item });
}
export async function PUT(req:Request){
  await dbConnect();
  const data = await req.json();
  const item = await Humor.findOneAndUpdate({}, data, { upsert:true, new:true });
  return NextResponse.json(item);
}
