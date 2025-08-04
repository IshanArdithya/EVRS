import mongoose from "mongoose";

const pendingSub = {
  address: { type: String, default: "" },
  code: { type: String, default: "" },
  expires: { type: Date, default: null },
};

const hcpSchema = new mongoose.Schema(
  {
    hcpId: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["doctor", "nurse", "midwife"],
      required: true,
    },
    fullName: {
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
    nic: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // otp for email
    pendingEmail: {
      address: pendingSub.address,
      code: pendingSub.code,
      expires: pendingSub.expires,
    },

    // otp for phone
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

export default mongoose.model("HealthcareProvider", hcpSchema);
