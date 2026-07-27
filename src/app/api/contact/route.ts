export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    if (form.get("company")) return NextResponse.json({ ok: true }); // honeypot
    return NextResponse.redirect(new URL("/?sent=1", req.url));
  } catch {
    return NextResponse.json(
      { error: "Invalid contact form submission" },
      { status: 400 }
    );
  }
}
