import mongoose, { Schema, models } from "mongoose";

const ItemSchema = new Schema(
  {
    date: String,
    title: { type: String, required: true },
    subtitle: String,
    text: { type: String, default: "" },

    // 👇 add these if they’re not already there
    mediaKind: { type: String, enum: ["youtube", "audio", "video", null], default: null },
    mediaUrl: { type: String, default: "" },
    mediaTitle: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
  },
  { _id: false }
);

const DailySectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // "sundaySchool", etc
    items: { type: [ItemSchema], default: [] },
  },
  { timestamps: true }
);

export default models.DailySection ||
  mongoose.model("DailySection", DailySectionSchema);
