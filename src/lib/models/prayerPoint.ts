import mongoose, { Schema, Document } from "mongoose";

export interface IPrayerPoint extends Document {
  title: string;
  content: string;
  createdAt: Date;
}

const PrayerPointSchema = new Schema<IPrayerPoint>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite in dev mode
export const PrayerPoint =
  mongoose.models.PrayerPoint || mongoose.model<IPrayerPoint>("PrayerPoint", PrayerPointSchema);
