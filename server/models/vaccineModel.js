import mongoose from "mongoose";

const vaccineSchema = new mongoose.Schema(
  {
    vaccineId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sideEffects: {
      type: String,
      default: "",
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

export default mongoose.model("Vaccine", vaccineSchema);
