import { Schema, model, models, InferSchemaType } from "mongoose";

const DeliveranceSchema = new Schema({
  zoomId: String,
  zoomPasscode: String,
  instructions: String,
}, { timestamps: true });

export type DeliveranceDoc = InferSchemaType<typeof DeliveranceSchema>;

const DeliveranceModel =
  models.Deliverance || model<DeliveranceDoc>("Deliverance", DeliveranceSchema);

export default DeliveranceModel;
