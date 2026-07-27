import mongoose, { Schema, model, models } from "mongoose";

const TestimonySchema = new Schema(
  {
    title: { type: String, required: true },
    name: { type: String, default: "" },
    body: { type: String, required: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type TestimonyDoc = {
  _id: string;
  title: string;
  name?: string;
  body: string;
  approved?: boolean;
};

const Testimony: mongoose.Model<any> =
  (models.Testimony as mongoose.Model<any>) ||
  model<any>("Testimony", TestimonySchema);

export default Testimony;
