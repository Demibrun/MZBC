export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import { SiteSettings } from "../../../lib/models";
import { settingsSchema } from "../../../lib/schema";
import { requireAdmin } from "../_utils";

export async function GET(){
  await dbConnect();
  const s = await SiteSettings.findOne();
  return NextResponse.json(s);
}

export async function POST(req: NextRequest){
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  await dbConnect();
  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const s = await SiteSettings.findOneAndUpdate({}, parsed.data, { new: true, upsert: true });
  return NextResponse.json(s);
}
