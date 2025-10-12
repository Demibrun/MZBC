import { Schema, model, models } from "mongoose";

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

export default models.Testimony || model("Testimony", TestimonySchema);
