import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions as any);
  const isAdmin = session && (session as any).role === "ADMIN";
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}
