import mongoose from "mongoose";

const mohSchema = new mongoose.Schema(
  {
    mohId: {
      type: String,
      required: true,
      unique: true,
    },
    mohName: {
      type: String,
      required: true,
    },
    contactNumber: {
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
  },
  { timestamps: true }
);

export default mongoose.model("MOH", mohSchema);
