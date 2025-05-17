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
      unique: true,
    },
    password:String,
    dealingIn: {
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
    email: {
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
      trim: true,
      unique: true,
    },
    UHBVNGSTNum: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      lowercase: true,
      required: true,
      enum: ["admin", "user", "firm"],
      default: "firm",
    },
    avatar: String,
    extraPremiumCharges: Number,
    refreshToken: {
      type: String,
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

firmSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hash(this.password, 12);
});

firmSchema.methods.passwordCheck = async function (password) {
  return await bcrypt.compare(password, this.password);
};

firmSchema.methods.generateToken = async function (data, secret, expiresIn) {
  return await jwt.sign(data, secret, expiresIn);
};
export const Firm = mongoose.model("Firm", firmSchema);
