import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest){
  const form = await req.formData();
  if(form.get("company")) return NextResponse.json({ ok: true }); // honeypot
  return NextResponse.redirect(new URL("/?sent=1", req.url));
}
