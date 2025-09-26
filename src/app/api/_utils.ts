// src/app/api/_utils.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "mz_admin";
const PASSWORD = process.env.ADMIN_PASSWORD || "mzbcwebsite";

/** Return NextResponse 401 if not admin, otherwise null */
export function requireAdmin() {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  if (!cookie || cookie !== PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Returns true/false for admin without creating a response */
export function isAdmin() {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  return !!cookie && cookie === PASSWORD;
}

/** Set admin cookie (HTTPOnly) */
export function setAdminCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: PASSWORD,
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
