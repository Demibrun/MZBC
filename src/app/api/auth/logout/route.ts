// src/app/api/auth/logout/route.ts
import { clearAdminCookie } from "../../_utils";

export const dynamic = "force-dynamic";

export async function POST() {
  return clearAdminCookie();
}
