// src/app/api/auth/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }
  return NextResponse.json({ authed: true });
}
