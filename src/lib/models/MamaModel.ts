import mongoose, { Schema, models } from "mongoose";

const MamaSchema = new Schema(
  {
    title: { type: String, default: "" },
    // store both the raw input and the derived ID (like Media stores url/thumbnail)
    url: { type: String, required: true },       // full YouTube URL or bare ID
    videoId: { type: String, required: true },   // always 11-char ID
  },
  { timestamps: true }
);

const MamaModel = (models.Mama as mongoose.Model<any>) || mongoose.model("Mama", MamaSchema);
export default MamaModel;
