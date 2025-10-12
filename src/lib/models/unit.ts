import { Schema, model, models } from "mongoose";

const UnitSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    joinLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Unit || model("Unit", UnitSchema);
