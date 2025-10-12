import mongoose, { Schema, models } from "mongoose";

const MediaSchema = new Schema(
  {
    kind: { type: String, enum: ["youtube", "photo", "audio"], required: true },
    title: { type: String, default: "" },
    url: { type: String, required: true },      // videoId or URL
    thumbnail: { type: String, default: "" },
  },
  { timestamps: true }
);

export type MediaDoc = mongoose.InferSchemaType<typeof MediaSchema>;

export const Media =
  (models.Media as mongoose.Model<MediaDoc>) ||
  mongoose.model<MediaDoc>("Media", MediaSchema);
