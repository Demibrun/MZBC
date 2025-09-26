import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({} as any));
  const correct = (process.env.ADMIN_PASSWORD || "mzbc-admin");

  if (!password || password !== correct) {
    return NextResponse.json(
      { error: "bad auth : authentication failed" },
      { status: 401 }
    );
  }

  // 12 hours
  const maxAge = 60 * 60 * 12;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const res = NextResponse.json({ ok: true });

  res.headers.append(
    "Set-Cookie",
    `ADMIN_SESSION=ok; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
  );

  return res;
}
