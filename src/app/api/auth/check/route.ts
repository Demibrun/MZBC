// src/app/api/auth/check/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdmin } from "../../_utils";

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
