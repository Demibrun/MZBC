// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { setAdminCookie } from "../../_utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({} as any));
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set" }, { status: 500 });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  // Set cookie and return {ok:true}
  return setAdminCookie(password);
}
