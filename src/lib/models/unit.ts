import mongoose, { Schema, model, models } from "mongoose";

const UnitSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    joinLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Unit: mongoose.Model<any> =
  (models.Unit as mongoose.Model<any>) || model<any>("Unit", UnitSchema);

export default Unit;
