import { Schema, model, models } from "mongoose";

const HumorSchema = new Schema(
  {
    humor: { type: String, default: "" },
    scienceFact: { type: String, default: "" },
    healthFact: { type: String, default: "" },
  },
  { timestamps: true }
);

// single document collection
export default models.Humor || model("Humor", HumorSchema);
