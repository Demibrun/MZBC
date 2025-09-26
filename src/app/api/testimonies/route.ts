import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import { Testimony } from "@/lib/models";

function isAdmin() {
  return cookies().get("mzbc_admin")?.value === "1";
}

// GET /api/testimonies?pending=1 -> pending only
// GET /api/testimonies            -> approved only (for public pages)
export async function GET(req: Request) {
  await dbConnect();
  const url = new URL(req.url);
  const pending = url.searchParams.get("pending");
  const q: any = pending ? { approved: false } : { approved: true };
  const items = await Testimony.find(q).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

// POST
// - Public can post (approved=false by default)
// - Admin can post approved immediately
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const created = await Testimony.create({
    title: body.title,
    name: body.name,
    body: body.body,
    approved: isAdmin() ? true : false,
  });
  return NextResponse.json(created);
}

// PUT approve/reject (admin only)
export async function PUT(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const body = await req.json();
  await Testimony.updateOne({ _id: body.id }, { approved: !!body.approve });
  return NextResponse.json({ ok: true });
}

// DELETE (admin only)
export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) await Testimony.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}
