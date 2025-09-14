// Force Node runtime so we can use fs/promises
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Convert Web File -> ArrayBuffer -> Uint8Array (ArrayBufferView)
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer); // <-- TypeScript-friendly for writeFile

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const fileName = `${randomUUID()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, bytes); // <-- accepts Uint8Array without errors

  const url = `/uploads/${fileName}`; // served from /public
  return NextResponse.json({ url });
}
