import mongoose from "mongoose";
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
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const billSchema = new mongoose.Schema(
  {
    createdBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    approvedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
    estimateNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    billNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    billData: [{ dataSchema }],
    billAmount: Number,
    nameOfWork: String,
    workOrderNo: String,
    workOrderDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);
