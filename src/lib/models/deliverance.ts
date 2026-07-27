import mongoose, { Schema, model, models } from "mongoose";

const DeliveranceSchema = new Schema(
  {
    zoomId: { type: String, default: "" },
    zoomPasscode: { type: String, default: "" },
    instructions: { type: String, default: "" },
  },
  { timestamps: true }
);

// single document collection
const Deliverance: mongoose.Model<any> =
  (models.Deliverance as mongoose.Model<any>) ||
  model<any>("Deliverance", DeliveranceSchema);

export default Deliverance;
