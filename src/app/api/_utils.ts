// src/app/api/_utils.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function requireAdmin() {
  const c =
    cookies().get("mz_admin")?.value ??
    cookies().get("mz_auth")?.value ??
    cookies().get("admin")?.value;
  const secret = process.env.ADMIN_SECRET || process.env.AUTH_SECRET;

  const ok = !!c && (!!secret ? c === secret : true);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
