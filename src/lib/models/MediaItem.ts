// src/lib/models/MediaItem.ts
import mongoose, { Schema, model, models } from "mongoose";

const MediaSchema = new Schema({
  kind: { type: String, enum: ["youtube","photo","audio","video"], required: true },
  title: { type: String, default: "" },
  url: { type: String, required: true }, // for youtube it'll be the videoId or full url for uploaded file
  thumbnail: { type: String, default: "" },
  provider: { type: String, default: "" },
  public_id: { type: String, default: "" },
  createdAt: { type: Date, default: () => new Date() },
});

const MediaItem: mongoose.Model<any> =
  (models.MediaItem as mongoose.Model<any>) || model<any>("MediaItem", MediaSchema);
export default MediaItem;
