// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin";

const PASSWORD = process.env.ADMIN_PASSWORD ?? "mzbcwebsite";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body?.password || "");
  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  return setAdminCookie();
}
