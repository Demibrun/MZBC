// src/app/api/_utils.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Simple cookie-based admin gate.
 * On login, you set cookie "mz_admin" to the exact ADMIN_PASSWORD.
 * If it matches, user is admin.
 */
export function requireAdmin() {
  const cookie = cookies().get("mz_admin")?.value;
  const expected = process.env.ADMIN_PASSWORD || "mzbcwebsite";
  if (!cookie || cookie !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null; // OK
}
