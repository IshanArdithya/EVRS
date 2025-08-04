import mongoose from "mongoose";

const pendingSub = {
  address: { type: String, default: "" },
  code: { type: String, default: "" },
  expires: { type: Date, default: null },
};

const mohSchema = new mongoose.Schema(
  {
    mohId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    pendingPhone: {
      number: { type: String, default: "" },
      code: pendingSub.code,
      expires: pendingSub.expires,
    },
    recordedBy: {
      id: { type: String, required: true },
      role: {
        type: String,
        enum: ["admin"],
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("MOH", mohSchema);
