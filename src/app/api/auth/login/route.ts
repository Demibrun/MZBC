import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  const ok = password && password === process.env.ADMIN_PASSWORD;
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  setAdminCookie(res);
  return res;
}
