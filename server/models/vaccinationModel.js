import mongoose from "mongoose";

const vaccinationSchema = new mongoose.Schema(
  {
    vaccinationId: {
      type: String,
      required: true,
      unique: true,
    },
    citizenId: {
      type: String,
      required: true,
    },
    vaccineId: {
      type: String,
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    healthcareProviderId: {
      type: String,
      required: true,
    },
    vaccinationLocation: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
    additionalNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("VaccinationRecord", vaccinationSchema);
