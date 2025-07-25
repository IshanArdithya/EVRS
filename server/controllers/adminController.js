import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/adminModel.js";

function generateAdminId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `A${digits}`;
}

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

export const registerAdmin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const rawPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newAdmin = await Admin.create({
      adminId: generateAdminId(),
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        adminId: newAdmin.adminId,
        email: newAdmin.email,
        password: rawPassword,
      },
    });
  } catch (error) {
    console.error("Register Admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
