import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
