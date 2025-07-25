import mongoose from "mongoose";

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

export default mongoose.model("Hospital", hospitalSchema);
