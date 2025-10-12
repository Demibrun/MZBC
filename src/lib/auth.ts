import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "mz_admin";

// True if the admin cookie is present
export function isAdmin(req?: NextRequest): boolean {
  try {
    const v = req ? req.cookies.get(ADMIN_COOKIE)?.value
                  : cookies().get(ADMIN_COOKIE)?.value;
    return v === "1";
  } catch {
    return false;
  }
}

// Return undefined when authorized, or a 401 response when not.
export function requireAdmin(req?: NextRequest) {
  if (isAdmin(req)) return undefined;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
