import mongoose, { Schema, model, models } from "mongoose";

const PrayerPointSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export type PrayerPointDoc = {
  _id: string;
  title: string;
  body: string;
};

const PrayerPoint: mongoose.Model<any> =
  (models.PrayerPoint as mongoose.Model<any>) ||
  model<any>("PrayerPoint", PrayerPointSchema);

export default PrayerPoint;
