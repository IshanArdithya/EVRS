import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    citizenId: {
      type: String,
      required: true,
      unique: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
    guardianNIC: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    recordedBy: {
      id: { type: String, required: true },
      role: {
        type: String,
        enum: ["hcp", "hospital", "moh", "admin"],
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
