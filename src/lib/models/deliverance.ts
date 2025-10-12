import { Schema, model, models } from "mongoose";

const DeliveranceSchema = new Schema(
  {
    zoomId: { type: String, default: "" },
    zoomPasscode: { type: String, default: "" },
    instructions: { type: String, default: "" },
  },
  { timestamps: true }
);

// single document collection
export default models.Deliverance || model("Deliverance", DeliveranceSchema);
