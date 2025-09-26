// src/app/api/testimonies/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Testimony } from "@/lib/models";
import { requireAdmin } from "../_utils";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");
  const pending = searchParams.get("pending");

  let query: any = {};
  if (!all && !pending) query.approved = true;
  if (pending) query.approved = false;

  const items = await Testimony.find(query).sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({ items });
}

// Admin can create approved testimonies directly
export async function POST(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const { title, name, body: tBody, approved } = body || {};
  if (!title || !tBody) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const created = await Testimony.create({
    title,
    name: name || "",
    body: tBody,
    approved: approved === true,
  });
  return NextResponse.json(created.toObject());
}

// Approve/Reject by id
export async function PUT(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const body = await req.json();
  const { id, approve } = body || {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await Testimony.updateOne({ _id: id }, { $set: { approved: !!approve } }).exec();
  return NextResponse.json({ ok: true });
}

// Delete by id
export async function DELETE(req: Request) {
  const notAdmin = requireAdmin();
  if (notAdmin) return notAdmin;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await Testimony.deleteOne({ _id: id }).exec();
  return NextResponse.json({ ok: true });
}
