import mongoose, { Schema, models } from "mongoose";

const DailyItemSchema = new Schema(
  {
    date: String,                 // optional display date
    title: { type: String, required: true },
    subtitle: String,
    text: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

const DailySectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // "wordOfDay" | "prophetic" | ...
    items: { type: [DailyItemSchema], default: [] },
  },
  { timestamps: true }
);

export type DailySectionDoc = mongoose.InferSchemaType<typeof DailySectionSchema>;

export const DailySection =
  (models.DailySection as mongoose.Model<DailySectionDoc>) ||
  mongoose.model<DailySectionDoc>("DailySection", DailySectionSchema);
