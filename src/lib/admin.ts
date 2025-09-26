// src/lib/admin.ts
export const ADMIN_COOKIE = "mzbc_admin";

export function parseCookieString(cookieHeader: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  const pairs = cookieHeader.split(/;\s*/);
  for (const pair of pairs) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const key = decodeURIComponent(pair.slice(0, eq).trim());
    const val = decodeURIComponent(pair.slice(eq + 1).trim());
    if (key) out[key] = val;
  }
  return out;
}

export function getClientCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const all = parseCookieString(document.cookie || "");
  return all[name];
}

export function isAdminClient(): boolean {
  return getClientCookie(ADMIN_COOKIE) === "1";
}
