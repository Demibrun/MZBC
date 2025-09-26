// src/app/api/media/upload/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ensure Node runtime on Vercel

import { NextResponse } from "next/server";
import { requireAdmin } from "../../_utils";
import { v2 as cloudinary } from "cloudinary";

// Configure via one env var or three individual ones
// Preferred: CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"
if (!process.env.CLOUDINARY_URL) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env as Record<string, string>;
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
} else {
  cloudinary.config(true); // use CLOUDINARY_URL
}

function bufferFromFile(f: File) {
  return f.arrayBuffer().then((ab) => Buffer.from(ab));
}

export async function POST(req: Request) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  try {
    const form = await req.formData();
    const kind = (form.get("kind") as string) || ""; // "photo" | "audio"
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buf = await bufferFromFile(file);

    // Pick Cloudinary resource type
    const resource_type = kind === "audio" ? "video" : "image";
    // NOTE: Cloudinary treats audio as 'video' resource_type

    const uploaded: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "mzbc",
          resource_type,
          public_id: undefined, // let Cloudinary generate
          overwrite: false,
          context: title ? { caption: title, alt: title } : undefined,
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buf);
    });

    // Normalize the return
    const url: string = uploaded.secure_url;
    // For images we can pass a derived thumbnail. For audio we keep url only.
    const thumbnail =
      resource_type === "image"
        ? uploaded.secure_url
        : undefined;

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
