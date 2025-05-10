import mongoose from "mongoose";
// ----- model for saving data related to bills like items description, measurment unit, amount or rate----
const dataSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const BillData = mongoose.model("BillData", dataSchema);
