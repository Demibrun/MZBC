// src/app/api/announcements/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/db";

// Simple cookie-based auth (must match your /api/auth/login setter)
function isAuthedFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  return /ADMIN_SESSION=ok/.test(cookie);
}

export async function GET() {
  await dbConnect();

  const col = mongoose.connection.db.collection("announcements");
  const list = await col.find({}).sort({ createdAt: -1 }).toArray();

  // normalize _id for the client
  const normalized = list.map((d: any) => ({
    ...d,
    _id: d._id?.toString?.(),
  }));

  return NextResponse.json(normalized);
}

export async function POST(req: Request) {
  if (!isAuthedFromCookie(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json().catch(() => ({}));

  const doc = {
    title: body.title ?? "",
    body: body.body ?? "",
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null,
    featured: !!body.featured,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const col = mongoose.connection.db.collection("announcements");
  const res = await col.insertOne(doc as any);

  return NextResponse.json({ ...doc, _id: res.insertedId.toString() });
}

export async function PUT(req: Request) {
  if (!isAuthedFromCookie(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json().catch(() => ({}));
  const { id, ...rest } = body || {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const col = mongoose.connection.db.collection("announcements");

  const update: any = { updatedAt: new Date() };
  if (rest.title !== undefined) update.title = rest.title;
  if (rest.body !== undefined) update.body = rest.body;
  if (rest.startDate !== undefined)
    update.startDate = rest.startDate ? new Date(rest.startDate) : null;
  if (rest.endDate !== undefined)
    update.endDate = rest.endDate ? new Date(rest.endDate) : null;
  if (rest.featured !== undefined) update.featured = !!rest.featured;

  await col.updateOne({ _id: new ObjectId(id) }, { $set: update });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAuthedFromCookie(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const col = mongoose.connection.db.collection("announcements");
  await col.deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ ok: true });
}
