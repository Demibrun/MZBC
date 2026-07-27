// src/lib/requireAdmin.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function requireAdmin() {
  const ck = cookies();
  const admin = ck.get("mz_admin")?.value;
  if (admin !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null; // OK
}
