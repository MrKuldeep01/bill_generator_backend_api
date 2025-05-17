import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
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
      uppercase: true,
    },
    role: {
      type: String,
      lowercase: true,
      enum: ["admin", "user", "firm"],
      default: "user",
    },
    worksUnder: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
    worksBuddy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    firm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
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
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.passwordCheck = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function (data, secret, expiresIn) {
  return jwt.sign(data, secret,{ expiresIn});
};

export const User = mongoose.model("User", userSchema);
