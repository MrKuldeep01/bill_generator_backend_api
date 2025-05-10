import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["M", "F", "O"],
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    password: {
      type: String,
    },
    mobile: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    firmName: String,
    firmLogo: String,
    availableUsers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    worksBuddy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
  },
  { timestamps: true }
);

adminSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hash(this.password, 12);
});

adminSchema.methods.passwordCheck = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateToken = async function (data, secret, expiresIn) {
  return await jwt.sign(data, secret, expiresIn);
};

export const Admin = mongoose.model("Admin", adminSchema);
