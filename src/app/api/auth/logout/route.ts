// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // expire the cookie
  res.cookies.set("mzbc_admin", "", { path: "/", httpOnly: true, maxAge: 0 });
  return res;
}
