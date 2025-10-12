import { Schema, model, models } from "mongoose";

const PastorSchema = new Schema(
  {
    name: { type: String, required: true },
    photoUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Pastor || model("Pastor", PastorSchema);
