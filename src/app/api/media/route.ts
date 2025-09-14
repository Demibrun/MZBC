export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import { SiteSettings } from "../../../lib/models";
export async function GET(){ await dbConnect(); const s = await SiteSettings.findOne(); return NextResponse.json([s?.yt1, s?.yt2, s?.yt3].filter(Boolean)); }
