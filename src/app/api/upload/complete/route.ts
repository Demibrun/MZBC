export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../_utils";
import { recordUploadUsage } from "@/lib/uploadQuota";

export async function POST(req: NextRequest) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  const body = await req.json().catch(() => ({}));
  const fileSize = Number(body?.fileSize || 0);

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return NextResponse.json({ error: "Invalid file size" }, { status: 400 });
  }

  await recordUploadUsage(fileSize);
  return NextResponse.json({ ok: true });
}
