import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/adminModel.js";
import Patient from "../models/patientModel.js";
import VaccinationRecord from "../models/vaccinationModel.js";
import fetch from "node-fetch";

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

export const getAllAdmins = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ email: regex }, { adminId: regex }];
    }

    const admins = await Admin.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(admins);
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export async function changePassword(req, res) {
  const { adminId } = req.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both current and new passwords are required" });
  }
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters" });
  }

  try {
    const admin = await Admin.findOne({ adminId }).select("password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const sameAsOld = await bcrypt.compare(newPassword, admin.password);
    if (sameAsOld) {
      return res
        .status(400)
        .json({ message: "New password must be different from current" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export const getAdminProfile = async (req, res) => {
  const { adminId } = req.user;

  try {
    const admin = await Admin.findOne({ adminId })
      .select("-password -__v")
      .lean();
    res.status(200).json({
      loggedIn: true,
      admin: { adminId: admin.adminId, email: admin.email },
    });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export const getRisks = async (req, res) => {
  try {
    const patients = await Patient.find({}).lean();
    if (!patients.length) {
      return res.status(200).json({
        stats: {
          total: 0,
          highPercent: "0.0",
          mediumPercent: "0.0",
          lowPercent: "0.0",
        },
        highRisk: [],
        mediumRisk: [],
        lowRisk: [],
      });
    }

    const patientMap = new Map();
    patients.forEach((patient) => {
      patientMap.set(patient.citizenId, {
        firstName: patient.firstName,
        lastName: patient.lastName,
        district: patient.district,
        division: patient.division,
      });
    });

    const payload = { mode: "latest", events: [] };
    for (const patient of patients) {
      const vaccinations = await VaccinationRecord.find({
        citizenId: patient.citizenId,
      })
        .sort({ createdAt: 1 })
        .limit(4)
        .lean();

      // map patient and vaccination data
      const citizen = {
        citizenId: patient.citizenId,
        birthDate: patient.birthDate
          ? patient.birthDate.toISOString().split("T")[0]
          : null,
        district: patient.district || null,
        division: patient.division || null,
        bloodType: patient.bloodType || null,
        allergies: patient.allergies || [],
        medicalConditions: patient.medicalConditions || [],
        guardianPhone: patient.phoneNumber || null,
        guardianEmail: patient.email || null,
        hospitalId: patient.recordedBy?.id || null,
        mohId: null,
      };

      vaccinations.forEach((vax, index) => {
        citizen[`v${index + 1}Code`] = vax.vaccineId || null;
        citizen[`v${index + 1}Date`] = vax.createdAt
          ? vax.createdAt.toISOString().split("T")[0]
          : null;
        citizen[`v${index + 1}Location`] = vax.vaccinationLocation || null;
        citizen[`v${index + 1}HcpId`] = vax.recordedBy?.id || null;
      });

      payload.events.push(citizen);
    }

    // call FastAPI
    const fastApiUrl = `${process.env.FAST_API_URL}/score`;
    const response = await fetch(fastApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`);
    }

    const result = await response.json();
    const results = result.results || [];

    // stats
    const total = results.length;
    const highRisk = results.filter((r) => r.risk_tier === "High");
    const mediumRisk = results.filter((r) => r.risk_tier === "Medium");
    const lowRisk = results.filter((r) => r.risk_tier === "Low");
    const stats = {
      total,
      highPercent: total ? ((highRisk.length / total) * 100).toFixed(1) : "0.0",
      mediumPercent: total
        ? ((mediumRisk.length / total) * 100).toFixed(1)
        : "0.0",
      lowPercent: total ? ((lowRisk.length / total) * 100).toFixed(1) : "0.0",
    };

    const mapRiskData = (riskArray) =>
      riskArray.map((r) => ({
        citizenId: r.citizenId,
        firstName: patientMap.get(r.citizenId)?.firstName || "N/A",
        lastName: patientMap.get(r.citizenId)?.lastName || "N/A",
        district: patientMap.get(r.citizenId)?.district || "N/A",
        division: patientMap.get(r.citizenId)?.division || "N/A",
        doseNumber: r.dose_number,
        riskProb: r.risk_prob,
        riskTier: r.risk_tier,
        dueBy: r.due_by,
        recommendedAction: r.recommended_action,
      }));

    res.status(200).json({
      stats,
      highRisk: mapRiskData(highRisk),
      mediumRisk: mapRiskData(mediumRisk),
      lowRisk: mapRiskData(lowRisk),
    });
  } catch (error) {
    console.error("Error in /api/admin/risks:", error);
    res.status(500).json({ error: "Failed to fetch risk scores" });
  }
};
