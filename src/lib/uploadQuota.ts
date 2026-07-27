import mongoose, { Schema, model, models } from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";

const MB = 1024 * 1024;

const UploadUsageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    scope: { type: String, enum: ["day", "week"], required: true },
    bytes: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    expireAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

const UploadUsage: mongoose.Model<any> =
  (models.UploadUsage as mongoose.Model<any>) ||
  model<any>("UploadUsage", UploadUsageSchema);

type UploadUsageRecord = {
  bytes?: number;
  count?: number;
};

function numberEnv(name: string, fallback: number) {
  const raw = process.env[name];
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function dayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function weekKey(now = new Date()) {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function addDays(now: Date, days: number) {
  const next = new Date(now);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function getUploadQuota() {
  return {
    maxFileBytes: numberEnv("UPLOAD_MAX_FILE_MB", 4) * MB,
    directMaxFileBytes: numberEnv("UPLOAD_DIRECT_MAX_FILE_MB", 100) * MB,
    dailyBytes: numberEnv("UPLOAD_DAILY_LIMIT_MB", 25) * MB,
    directDailyBytes: numberEnv("UPLOAD_DIRECT_DAILY_LIMIT_MB", 250) * MB,
    weeklyBytes: numberEnv("UPLOAD_WEEKLY_LIMIT_MB", 100) * MB,
    directWeeklyBytes: numberEnv("UPLOAD_DIRECT_WEEKLY_LIMIT_MB", 1000) * MB,
    dailyCount: numberEnv("UPLOAD_DAILY_LIMIT_COUNT", 20),
  };
}

function mb(bytes: number) {
  return Math.round((bytes / MB) * 10) / 10;
}

export async function checkUploadQuota(
  fileSize: number,
  opts?: { maxFileBytes?: number; dailyBytes?: number; weeklyBytes?: number }
) {
  const quota = getUploadQuota();
  const maxFileBytes = opts?.maxFileBytes ?? quota.maxFileBytes;
  const dailyLimitBytes = opts?.dailyBytes ?? quota.dailyBytes;
  const weeklyLimitBytes = opts?.weeklyBytes ?? quota.weeklyBytes;

  if (fileSize > maxFileBytes) {
    return NextResponse.json(
      { error: `File is too large. Maximum upload size is ${mb(maxFileBytes)} MB.` },
      { status: 413 }
    );
  }

  await dbConnect();

  const now = new Date();
  const dailyKey = `upload-day:${dayKey(now)}`;
  const weeklyKey = `upload-week:${weekKey(now)}`;
  const [daily, weekly] = (await Promise.all([
    UploadUsage.findOne({ key: dailyKey }).lean().exec(),
    UploadUsage.findOne({ key: weeklyKey }).lean().exec(),
  ])) as [UploadUsageRecord | null, UploadUsageRecord | null];

  const dailyBytes = Number(daily?.bytes || 0);
  const dailyCount = Number(daily?.count || 0);
  const weeklyBytes = Number(weekly?.bytes || 0);

  if (dailyCount + 1 > quota.dailyCount) {
    return NextResponse.json(
      { error: `Daily upload count reached. Try again tomorrow. Limit: ${quota.dailyCount} uploads/day.` },
      { status: 429 }
    );
  }

  if (dailyBytes + fileSize > dailyLimitBytes) {
    return NextResponse.json(
      { error: `Daily upload size reached. Limit: ${mb(dailyLimitBytes)} MB/day.` },
      { status: 429 }
    );
  }

  if (weeklyBytes + fileSize > weeklyLimitBytes) {
    return NextResponse.json(
      { error: `Weekly upload size reached. Limit: ${mb(weeklyLimitBytes)} MB/week.` },
      { status: 429 }
    );
  }

  return null;
}

export async function recordUploadUsage(fileSize: number) {
  await dbConnect();
  const now = new Date();
  await Promise.all([
    UploadUsage.updateOne(
      { key: `upload-day:${dayKey(now)}` },
      {
        $setOnInsert: { scope: "day", expireAt: addDays(now, 35) },
        $inc: { bytes: fileSize, count: 1 },
      },
      { upsert: true }
    ).exec(),
    UploadUsage.updateOne(
      { key: `upload-week:${weekKey(now)}` },
      {
        $setOnInsert: { scope: "week", expireAt: addDays(now, 120) },
        $inc: { bytes: fileSize, count: 1 },
      },
      { upsert: true }
    ).exec(),
  ]);
}
