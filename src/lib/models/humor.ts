import mongoose, { Schema, model, models } from "mongoose";

const HumorSchema = new Schema(
  {
    humor: { type: String, default: "" },
    scienceFact: { type: String, default: "" },
    healthFact: { type: String, default: "" },
  },
  { timestamps: true }
);

// single document collection
const Humor: mongoose.Model<any> =
  (models.Humor as mongoose.Model<any>) || model<any>("Humor", HumorSchema);

export default Humor;
