export async function uploadToCloudinaryBrowser(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET!;
  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "mzbc";

  if (!cloudName || !preset) {
    throw new Error("Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_* env vars.");
  }

  const endpoint = "https://api.cloudinary.com/v1_1/dav6gfotz/auto/upload";
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);
  fd.append("folder", folder);

  const res = await fetch(endpoint, { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    secure_url: string;
    public_id: string;
    resource_type: "image" | "video" | "raw";
    bytes: number;
    format: string;
  }>;
}
