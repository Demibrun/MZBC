import mongoose, { Schema, models } from "mongoose";

const MamaVideoSchema = new Schema(
  {
    title: { type: String, default: "" },
    videoId: { type: String, required: true }, // normalized YouTube ID
  },
  { timestamps: true }
);

export default (models.MamaVideo as mongoose.Model<any>) ||
  mongoose.model("MamaVideo", MamaVideoSchema);
