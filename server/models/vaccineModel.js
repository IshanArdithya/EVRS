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
  },
  { timestamps: true }
);

export default mongoose.model("Vaccine", vaccineSchema);
