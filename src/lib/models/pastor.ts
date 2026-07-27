import mongoose, { Schema, model, models } from "mongoose";

const PastorSchema = new Schema(
  {
    name: { type: String, required: true },
    photoUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Pastor: mongoose.Model<any> =
  (models.Pastor as mongoose.Model<any>) || model<any>("Pastor", PastorSchema);

export default Pastor;
