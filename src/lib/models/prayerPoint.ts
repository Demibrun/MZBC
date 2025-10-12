import { Schema, model, models } from "mongoose";

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

export default models.PrayerPoint || model("PrayerPoint", PrayerPointSchema);
