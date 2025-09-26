import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Expire immediately
  res.headers.append(
    "Set-Cookie",
    "ADMIN_SESSION=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );
  return res;
}
