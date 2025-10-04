// src/app/api/media/upload/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../_utils"; // <- path is correct from /api/media/upload
import { v2 as cloudinary } from "cloudinary";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

/** Cloudinary config (if env is present) */
const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
if (hasCloudinaryUrl) {
  cloudinary.config(true); // use CLOUDINARY_URL
} else if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });
}

/** Helpers */
function bufferFromFile(f: File) {
  return f.arrayBuffer().then((ab) => Buffer.from(ab));
}

async function uploadToCloudinary(file: File, kind: string, title: string) {
  const buf = await bufferFromFile(file);
  const resource_type = kind === "audio" || kind === "video" ? "video" : "image";

  const uploaded: any = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "mzbc",
        resource_type,
        overwrite: false,
        context: title ? { caption: title, alt: title } : undefined,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buf);
  });

  const url: string = uploaded.secure_url;
  const thumbnail = resource_type === "image" ? uploaded.secure_url : undefined;

  return {
    ok: true,
    kind,
    url,
    title,
    thumbnail,
    provider: "cloudinary" as const,
    public_id: uploaded.public_id as string,
  };
}

async function saveToPublic(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const fileName = `${randomUUID()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, bytes);

  const url = `/uploads/${fileName}`; // served from /public
  return {
    ok: true,
    url,
    provider: "local" as const,
    public_id: fileName,
    thumbnail: undefined as string | undefined,
  };
}

/** POST /api/media/upload */
export async function POST(req: NextRequest) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    const form = await req.formData();
    const kind = (form.get("kind") as string) || ""; // "photo" | "audio" | "video"
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Prefer Cloudinary if configured; otherwise save to /public/uploads
    if (
      hasCloudinaryUrl ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
    ) {
      const result = await uploadToCloudinary(file, kind, title);
      return NextResponse.json(result);
    } else {
      const result = await saveToPublic(file);
      return NextResponse.json({
        ok: true,
        kind,
        title,
        ...result,
      });
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
