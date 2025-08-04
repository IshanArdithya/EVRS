import bcrypt from "bcryptjs";
import crypto from "crypto";
import HealthcareProvider from "../models/hcpModel.js";

function generateHcpId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `HCP${digits}`;
}

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

export const registerHCP = async (req, res) => {
  const { role, fullName, email, nic } = req.body;
  const { adminId, role: adminRole } = req.user;

  if (!role || !fullName || !email || !nic || !adminId || !adminRole) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["doctor", "nurse", "midwife"].includes(role.toLowerCase())) {
    return res
      .status(400)
      .json({ message: "Role must be either doctor, nurse or midwife" });
  }

  try {
    const exists = await HealthcareProvider.findOne({
      $or: [{ email }, { nic }],
    });
    if (exists) {
      return res.status(400).json({ message: "Email or NIC already exists" });
    }

    const rawPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newHCP = await HealthcareProvider.create({
      hcpId: generateHcpId(),
      role: role.toLowerCase(),
      fullName,
      email,
      nic,
      recordedBy: {
        id: adminId,
        role: adminRole,
      },
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Healthcare Provider registered successfully",
      hcp: {
        id: newHCP._id,
        hcpId: newHCP.hcpId,
        role: newHCP.role,
        fullName: newHCP.fullName,
        email: newHCP.email,
        nic: newHCP.nic,
        password: rawPassword,
      },
    });
  } catch (error) {
    console.error("Register HCP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllHCPs = async (req, res) => {
  try {
    const { role, search } = req.query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { hcpId: regex },
        { role: regex },
      ];
    }

    const hcps = await HealthcareProvider.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(hcps);
  } catch (error) {
    console.error("Get all HCPs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHCPById = async (req, res) => {
  try {
    const hcp = await HealthcareProvider.findOne({
      hcpId: req.params.hcpId,
    }).select("-password");

    if (!hcp) {
      return res.status(404).json({ message: "Healthcare Provider not found" });
    }

    res.status(200).json(hcp);
  } catch (error) {
    console.error("Get HCP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateHCPById = async (req, res) => {
  try {
    const { role, fullName, email, nic } = req.body;

    const hcp = await HealthcareProvider.findOne({ hcpId: req.params.hcpId });

    if (!hcp) {
      return res.status(404).json({ message: "Healthcare Provider not found" });
    }

    // validate role
    if (role && !["doctor", "nurse"].includes(role.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Role must be either doctor or nurse" });
    }

    hcp.role = role || hcp.role;
    hcp.fullName = fullName || hcp.fullName;
    hcp.email = email || hcp.email;
    hcp.nic = nic || hcp.nic;

    const updated = await hcp.save();

    res.status(200).json({
      message: "Healthcare Provider updated successfully",
      hcp: updated,
    });
  } catch (error) {
    console.error("Update HCP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteHCPById = async (req, res) => {
  try {
    const deleted = await HealthcareProvider.findOneAndDelete({
      hcpId: req.params.hcpId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Healthcare Provider not found" });
    }

    res
      .status(200)
      .json({ message: "Healthcare Provider deleted successfully" });
  } catch (error) {
    console.error("Delete HCP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
