import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const isAdmin = cookies().get("mzbc_admin")?.value === "1";
  return NextResponse.json({ ok: isAdmin });
}
