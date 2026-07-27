import mongoose, { Schema, model, models } from "mongoose";

const MinistryGroupSchema = new Schema(
  {
    key: { type: String, required: true },       // e.g. "women", "men"
    title: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    body: { type: String, default: "" },
  },
  { timestamps: true }
);

const MinistryGroup: mongoose.Model<any> =
  (models.MinistryGroup as mongoose.Model<any>) ||
  model<any>("MinistryGroup", MinistryGroupSchema);

export default MinistryGroup;
