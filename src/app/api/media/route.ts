import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";

/* --- permissive admin cookie check (same style as other routes) --- */
function isAdmin(req: NextRequest) {
  const c = req.cookies;
  const v =
    c.get("adm")?.value ||
    c.get("admin")?.value ||
    c.get("mzbc_admin")?.value ||
    c.get("MZBC_ADM")?.value;
  return v === "ok" || v === "1" || v?.toLowerCase() === "true" || v === "yes";
}

const ok = (data: any, status = 200) =>
  NextResponse.json(data, { status });
const bad = (msg = "Bad request", code = 400) =>
  NextResponse.json({ error: msg }, { status: code });

/* ----------------- GET: list recent media ----------------- */
export async function GET() {
  await dbConnect();
  const items = await MediaItem.find().sort({ createdAt: -1 }).limit(200).lean();
  return ok({ items: items || [] });
}

/* ------------- POST: create (accepts JSON or FormData) ------------- */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return bad("Unauthorized", 401);
  await dbConnect();

  const ct = req.headers.get("content-type") || "";
  let body: any = {};

  try {
    if (ct.includes("application/json")) {
      body = await req.json();
    } else if (
      ct.includes("multipart/form-data") ||
      ct.includes("application/x-www-form-urlencoded")
    ) {
      const fd = await req.formData();
      body = Object.fromEntries(fd.entries());
    }
  } catch (_) { /* ignore */ }

  const kind = String(body.kind || "").trim(); // youtube | photo | audio
  const title = String(body.title || "").trim();
  const url = String(body.url || "").trim();         // for youtube: VIDEO ID only
  const thumbnail = String(body.thumbnail || "").trim() || undefined;

  if (!["youtube", "photo", "audio"].includes(kind)) {
    return bad("Invalid kind");
  }
  if (!url) return bad("URL / Video ID is required");

  // minimal YT id check
  if (kind === "youtube" && url.length > 20) {
    return bad("For YouTube, provide the VIDEO ID (not the full URL).");
  }

  const created = await MediaItem.create({ kind, title, url, thumbnail });
  return ok(created, 201);
}

/* ------------------ DELETE: /api/media?id=... ------------------ */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return bad("Unauthorized", 401);
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return bad("Missing id");

  await MediaItem.deleteOne({ _id: id });
  return ok({ ok: true });
}
