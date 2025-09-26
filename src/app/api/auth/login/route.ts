// src/app/api/auth/login/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { setAdminCookie } from "../../_utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const provided = body?.password || "";
  const expected = process.env.ADMIN_PASSWORD || "mzbcwebsite";

  if (provided !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  setAdminCookie();
  return NextResponse.json({ ok: true });
}
