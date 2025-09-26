// src/app/api/media/upload/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdmin } from "../../_utils";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
if (!process.env.CLOUDINARY_URL) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env as Record<string, string>;
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
} else {
  cloudinary.config(true);
}

function bufferFromFile(f: File) {
  return f.arrayBuffer().then((ab) => Buffer.from(ab));
}

export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    const form = await req.formData();
    const kind = (form.get("kind") as string) || "";
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buf = await bufferFromFile(file);
    const resource_type = kind === "audio" ? "video" : "image";

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

    return NextResponse.json({
      ok: true,
      kind,
      url,
      title,
      thumbnail,
      provider: "cloudinary",
      public_id: uploaded.public_id,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
