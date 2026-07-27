/** Return NextResponse 401 if not admin, otherwise null */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mz_admin";

/** Returns NextResponse(401) when not admin, else null. */
export async function requireAdmin(_req?: NextRequest) {
  // cookie set by your /api/auth/login
  const c = cookies().get("mz_admin");
  if (!c || c.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}


/** Returns true/false for admin without creating a response */
export function isAdmin() {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  return cookie === "1";
}

/** Set admin cookie (HTTPOnly) */
export function setAdminCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: "1",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // session cookie; add expires if you want persistent
  });
}

/** Clear admin cookie */
export function clearAdminCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}
