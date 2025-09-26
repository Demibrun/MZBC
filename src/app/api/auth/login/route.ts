import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!verifyAdminPassword(password || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, "1", ADMIN_COOKIE_OPTIONS);
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Bad Request" }, { status: 400 });
  }
}
