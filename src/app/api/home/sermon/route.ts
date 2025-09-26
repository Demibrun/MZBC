import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Announcement } from "@/lib/models";
import { isAuthed } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const doc = await Announcement.findOne({ featured: true })
    .sort({ updatedAt: -1 })
    .lean();
  return NextResponse.json({ ok: true, item: doc || null });
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  await dbConnect();

  const { title, body, startDate, endDate } = await req.json();
  if (!title || !body) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  // un-feature all old
  await Announcement.updateMany({ featured: true }, { $set: { featured: false } });

  // create a new featured one (or you could reuse last featured if you prefer)
  const doc = await Announcement.create({
    title,
    body,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    featured: true,
  });

  return NextResponse.json({ ok: true, item: doc });
}
