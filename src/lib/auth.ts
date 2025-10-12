// src/lib/auth.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "mz_admin";

export function isAdmin() {
  // Works in all Node.js app routes (no need to pass req)
  return cookies().get(COOKIE_NAME)?.value === "1";
}

export function requireAdmin() {
  if (isAdmin()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function setAdminCookie(res: NextResponse) {
  // Lax is fine for same-origin admin pages
  res.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // secure: true, // uncomment in production on HTTPS
    // maxAge: 60*60*8, // optional 8h session
  });
  return res;
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
