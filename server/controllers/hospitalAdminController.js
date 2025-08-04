import bcrypt from "bcryptjs";
import crypto from "crypto";
import Hospital from "../models/hospitalModel.js";

function generateHospitalId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `H${digits}`;
}

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

export const registerHospital = async (req, res) => {
  const { name, email, province, district, recordedBy } = req.body;
  const { adminId, role: adminRole } = req.user;

  if (!name || !email || !province || !district || !adminId || !adminRole) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await Hospital.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Hospital with this email already exists" });
    }

    const rawPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newHospital = await Hospital.create({
      hospitalId: generateHospitalId(),
      name,
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
      message: "Hospital registered successfully",
      hospital: {
        id: newHospital._id,
        hospitalId: newHospital.hospitalId,
        name: newHospital.name,
        email: newHospital.email,
        province: newHospital.province,
        district: newHospital.district,
        password: rawPassword,
      },
    });
  } catch (error) {
    console.error("Register hospital error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const { province, district, search } = req.query;

    // Build filter object based on query params
    const filter = {};

    if (province) {
      filter.province = province;
    }

    if (district) {
      filter.district = district;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { hospitalId: regex }];
    }

    const hospitals = await Hospital.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Get all hospitals error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      hospitalId: req.params.hospitalId,
    }).select("-password");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    console.error("Get hospital by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateHospitalById = async (req, res) => {
  try {
    const { name, email, province, district } = req.body;

    const hospital = await Hospital.findOne({
      hospitalId: req.params.hospitalId,
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.name = name || hospital.name;
    hospital.email = email || hospital.email;
    hospital.province = province || hospital.province;
    hospital.district = district || hospital.district;

    const updated = await hospital.save();

    res.status(200).json({
      message: "Hospital updated successfully",
      hospital: updated,
    });
  } catch (error) {
    console.error("Update hospital error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteHospitalById = async (req, res) => {
  try {
    const deleted = await Hospital.findOneAndDelete({
      hospitalId: req.params.hospitalId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json({ message: "Hospital deleted successfully" });
  } catch (error) {
    console.error("Delete hospital error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
