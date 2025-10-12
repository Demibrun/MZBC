import { Schema, model, models } from "mongoose";

const MinistryGroupSchema = new Schema(
  {
    key: { type: String, required: true },       // e.g. "women", "men"
    title: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    body: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.MinistryGroup || model("MinistryGroup", MinistryGroupSchema);
