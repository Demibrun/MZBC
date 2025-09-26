// src/app/api/home/sermon/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { SiteSettings } from "@/lib/models";

// tiny helper: cookie-based admin gate
function isAdmin(req: NextRequest) {
  // our login sets this cookie to "1"
  return req.cookies.get("mz_admin")?.value === "1";
}

// GET: return current hero headline/sub
export async function GET() {
  await dbConnect();
  const doc =
    (await SiteSettings.findOne().lean()) ||
    (await SiteSettings.create({})).toObject();

  return NextResponse.json({
    heroHeadline: doc.heroHeadline || "",
    heroSub: doc.heroSub || "",
  });
}

// PUT: admin only — update hero headline/sub
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { heroHeadline, heroSub } = await req.json();

  const doc =
    (await SiteSettings.findOne()) || (await SiteSettings.create({}));

  if (typeof heroHeadline === "string") doc.heroHeadline = heroHeadline;
  if (typeof heroSub === "string") doc.heroSub = heroSub;

  await doc.save();

  return NextResponse.json({ ok: true });
}
