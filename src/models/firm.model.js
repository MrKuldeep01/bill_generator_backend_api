import mongoose from "mongoose";

const firmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    GSTNum: {
      type: String,
      required: true,
      trim: true,
    },
    DealingIn: {
      type: String,
      required: true,
      // default: " LT, HT, EHT AND GRID SUB STATION WORKS WITH GOVT. AND SEMI GOVT. AGENCIES",
      trim: true,
    },
    licenseType: {
      type: String,
      required: true,
      // default: "Govt. Electrical Contractor",
      trim: true,
    },
    licenseNum: {
      type: String,
      required: true,
      // default: "2428/16",
      trim: true,
    },
    gmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mobile01: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    mobile02: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    UHBVNGSTNum: {
      type: String,
      required: true,
      trim: true,
    },
    availableAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
  },
  { timestamps: true }
);

export const Firm = mongoose.model("Firm", firmSchema);
