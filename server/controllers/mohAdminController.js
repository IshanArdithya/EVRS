import bcrypt from "bcryptjs";
import crypto from "crypto";
import MOH from "../models/mohModel.js";

function generateMohId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `MOH${digits}`;
}

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

export const registerMOH = async (req, res) => {
  const { name, phoneNumber, email, province, district } = req.body;
  const { adminId, role: adminRole } = req.user;

  if (
    !name ||
    !phoneNumber ||
    !email ||
    !province ||
    !district ||
    !adminId ||
    !adminRole
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exists = await MOH.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ message: "MOH with this email already exists" });
    }

    const rawPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newMoh = await MOH.create({
      mohId: generateMohId(),
      name,
      phoneNumber,
      email,
      province,
      district,
      recordedBy: {
        id: adminId,
        role: adminRole,
      },
      password: hashedPassword,
    });

    res.status(201).json({
      message: "MOH registered successfully",
      moh: {
        id: newMoh._id,
        mohId: newMoh.mohId,
        name: newMoh.name,
        phoneNumber: newMoh.phoneNumber,
        email: newMoh.email,
        province: newMoh.province,
        district: newMoh.district,
        password: rawPassword,
      },
    });
  } catch (error) {
    console.error("Register MOH error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllMOHs = async (req, res) => {
  try {
    const { province, district, search } = req.query;

    const filter = {};

    if (province) {
      filter.province = province;
    }

    if (district) {
      filter.district = district;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { mohId: regex },
        { district: regex },
      ];
    }

    const mohs = await MOH.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(mohs);
  } catch (error) {
    console.error("Get all MOHs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMOHById = async (req, res) => {
  try {
    const moh = await MOH.findOne({ mohId: req.params.mohId }).select(
      "-password"
    );

    if (!moh) {
      return res.status(404).json({ message: "MOH not found" });
    }

    res.status(200).json(moh);
  } catch (error) {
    console.error("Get MOH error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMOHById = async (req, res) => {
  try {
    const { name, phoneNumber, email, province, district } = req.body;

    const moh = await MOH.findOne({ mohId: req.params.mohId });

    if (!moh) {
      return res.status(404).json({ message: "MOH not found" });
    }

    moh.name = name || moh.name;
    moh.phoneNumber = phoneNumber || moh.phoneNumber;
    moh.email = email || moh.email;
    moh.province = province || moh.province;
    moh.district = district || moh.district;

    const updated = await moh.save();

    res.status(200).json({
      message: "MOH updated successfully",
      moh: updated,
    });
  } catch (error) {
    console.error("Update MOH error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMOHById = async (req, res) => {
  try {
    const deleted = await MOH.findOneAndDelete({ mohId: req.params.mohId });

    if (!deleted) {
      return res.status(404).json({ message: "MOH not found" });
    }

    res.status(200).json({ message: "MOH deleted successfully" });
  } catch (error) {
    console.error("Delete MOH error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
