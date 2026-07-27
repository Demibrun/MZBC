export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "../../_utils";
import { checkUploadQuota, getUploadQuota } from "@/lib/uploadQuota";

type CloudinarySettings = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function getCloudinarySettings(): CloudinarySettings | null {
  if (process.env.CLOUDINARY_URL) {
    try {
      const parsed = new URL(process.env.CLOUDINARY_URL);
      return {
        cloudName: parsed.hostname,
        apiKey: decodeURIComponent(parsed.username),
        apiSecret: decodeURIComponent(parsed.password),
      };
    } catch {
      return null;
    }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

function resourceTypeFor(kind: string) {
  if (kind === "audio" || kind === "video") return "video";
  if (kind === "photo" || kind === "image") return "image";
  return "auto";
}

export async function POST(req: NextRequest) {
  const notAdmin = await requireAdmin();
  if (notAdmin) return notAdmin;

  const body = await req.json().catch(() => ({}));
  const kind = String(body?.kind || "photo");
  const fileSize = Number(body?.fileSize || 0);

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return NextResponse.json({ error: "Invalid file size" }, { status: 400 });
  }

  const quota = getUploadQuota();
  const quotaError = await checkUploadQuota(fileSize, {
    maxFileBytes: quota.directMaxFileBytes,
    dailyBytes: quota.directDailyBytes,
    weeklyBytes: quota.directWeeklyBytes,
  });
  if (quotaError) return quotaError;

  const settings = getCloudinarySettings();
  if (!settings) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server" },
      { status: 500 }
    );
  }

  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "mzbc";
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    settings.apiSecret
  );

  return NextResponse.json({
    cloudName: settings.cloudName,
    apiKey: settings.apiKey,
    folder,
    timestamp,
    signature,
    resourceType: resourceTypeFor(kind),
  });
}
