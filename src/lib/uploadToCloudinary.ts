// Client-side helper for UNSIGNED uploads (no api_key, no signature)
export async function uploadToCloudinaryBrowser(file: File, opts?: {
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  publicId?: string;
}) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET;
  const folder = opts?.folder ?? process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? "mzbc";
  const resourceType = opts?.resourceType ?? "auto";

  if (!cloud || !preset) {
    throw new Error("Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_* env vars.");
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset); // <— UNSIGNED preset only
  if (folder) fd.append("folder", folder);
  if (opts?.publicId) fd.append("public_id", opts.publicId);

  // DO NOT send api_key / timestamp / signature in the browser for unsigned uploads
  const res = await fetch(endpoint, { method: "POST", body: fd });
  const json = await res.json();

  if (!res.ok) {
    // Cloudinary always returns JSON with { error: { message } } on failure
    const msg = json?.error?.message || "Upload failed";
    throw new Error(msg);
  }
  return json as {
    asset_id: string;
    public_id: string;
    resource_type: string; // image|video|raw
    secure_url: string;
    url: string;
    bytes: number;
    format: string;
    // ...more fields
  };
}
