// src/lib/admin.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mz_admin";

/** true if the admin cookie is present */
export function isAuthed(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value === "1";
}

/** If not admin, return 401 response, otherwise return null. Use at the top of admin routes. */
export function requireAdmin(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Create the admin cookie */
export function setAdminCookie(): NextResponse {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}

/** Clear the admin cookie */
export function clearAdminCookie(): NextResponse {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
