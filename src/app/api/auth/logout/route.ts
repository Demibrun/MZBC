// src/app/api/auth/logout/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { clearAdminCookie } from "../../_utils";

export async function POST() {
  clearAdminCookie();
  return NextResponse.json({ ok: true });
}
