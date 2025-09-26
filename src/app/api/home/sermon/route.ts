import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { SiteSettings } from "@/lib/models";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  await dbConnect();
  const s: any = await (SiteSettings as any).findOne().lean();
  return NextResponse.json({
    heroHeadline: s?.heroHeadline ?? "",
    heroSub: s?.heroSub ?? "",
  });
}

export async function PUT(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  await dbConnect();
  const body = await req.json().catch(() => ({} as any));

  const heroHeadline =
    typeof body?.heroHeadline === "string" ? body.heroHeadline : "";
  const heroSub = typeof body?.heroSub === "string" ? body.heroSub : "";

  await (SiteSettings as any).updateOne(
    {},
    { $set: { heroHeadline, heroSub } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
