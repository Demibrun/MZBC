// src/app/api/_utils/requireAdmin.ts
import { NextRequest, NextResponse } from "next/server";

export async function requireAdmin(req: NextRequest) {
  const cookie = req.cookies.get("mzbc_admin")?.value;
  if (cookie !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
