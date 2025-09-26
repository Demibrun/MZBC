// src/app/api/auth/logout/route.ts
import { clearAdminCookie } from "@/lib/admin";

export async function POST() {
  return clearAdminCookie();
}
