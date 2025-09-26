import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/** true if ADMIN_SESSION=ok is present (works in Node/Edge/dev/prod) */
export function isAdmin(req: Request): boolean {
  try {
    // Prefer Next.js server cookies (reliable across runtimes)
    const c = cookies().get("ADMIN_SESSION")?.value;
    if (c === "ok") return true;
  } catch {
    // ignore; fall back to raw header below
  }

  const header = req.headers.get("cookie") || "";
  if (/ADMIN_SESSION=ok/.test(header)) return true;

  return false;
}

/** Return 401 NextResponse when not admin; otherwise null */
export function requireAdmin(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
