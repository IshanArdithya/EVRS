import mongoose from "mongoose";

const pendingSub = {
  address: { type: String, default: "" },
  code: { type: String, default: "" },
  expires: { type: Date, default: null },
};

const hospitalSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // otp for phone
    pendingPhone: {
      number: { type: String, default: "" },
      code: pendingSub.code,
      expires: pendingSub.expires,
    },
    recordedBy: {
      id: { type: String },
      role: {
        type: String,
        enum: ["admin"],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hospital", hospitalSchema);
