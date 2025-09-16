import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/adminModel.js";
import Patient from "../models/patientModel.js";
import VaccinationRecord from "../models/vaccinationModel.js";
import Vaccine from "../models/vaccineModel.js";
import Hospital from "../models/hospitalModel.js";
import HealthcareProvider from "../models/hcpModel.js";
import fetch from "node-fetch";
import districtToProvince from "../utils/districtToProvince.js";

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

export const getDashboardStats = async (req, res) => {
  try {
    // current month counts
    const totalHospitals = await Hospital.countDocuments();
    const totalHealthcareProviders = await HealthcareProvider.countDocuments();
    const totalCitizens = await Patient.countDocuments();
    const totalVaccinationRecords = await VaccinationRecord.countDocuments();

    // prev month counts
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);

    const prevHospitals = await Hospital.countDocuments({
      createdAt: { $lte: lastMonth },
    });
    const prevHealthcareProviders = await HealthcareProvider.countDocuments({
      createdAt: { $lte: lastMonth },
    });
    const prevCitizens = await Patient.countDocuments({
      createdAt: { $lte: lastMonth },
    });
    const prevVaccinationRecords = await VaccinationRecord.countDocuments({
      createdAt: { $lte: lastMonth },
    });

    // calc changes
    const hospitalChange =
      ((totalHospitals - prevHospitals) / (prevHospitals || 1)) * 100;
    const healthcareProviderChange =
      ((totalHealthcareProviders - prevHealthcareProviders) /
        (prevHealthcareProviders || 1)) *
      100;
    const citizenChange =
      ((totalCitizens - prevCitizens) / (prevCitizens || 1)) * 100;
    const vaccinationChange =
      ((totalVaccinationRecords - prevVaccinationRecords) /
        (prevVaccinationRecords || 1)) *
      100;

    const stats = [
      {
        title: "Total Hospitals",
        value: totalHospitals.toLocaleString(),
        change:
          hospitalChange >= 0
            ? `+${hospitalChange.toFixed(1)}%`
            : `${hospitalChange.toFixed(1)}%`,
        icon: "Building2",
        color: "text-blue-600",
      },
      {
        title: "Healthcare Providers",
        value: totalHealthcareProviders.toLocaleString(),
        change:
          healthcareProviderChange >= 0
            ? `+${healthcareProviderChange.toFixed(1)}%`
            : `${healthcareProviderChange.toFixed(1)}%`,
        icon: "UserPlus",
        color: "text-green-600",
      },
      {
        title: "Citizens",
        value: totalCitizens.toLocaleString(),
        change:
          citizenChange >= 0
            ? `+${citizenChange.toFixed(1)}%`
            : `${citizenChange.toFixed(1)}%`,
        icon: "FileUser",
        color: "text-purple-600",
      },
      {
        title: "Vaccination Records",
        value: totalVaccinationRecords.toLocaleString(),
        change:
          vaccinationChange >= 0
            ? `+${vaccinationChange.toFixed(1)}%`
            : `${vaccinationChange.toFixed(1)}%`,
        icon: "Syringe",
        color: "text-orange-600",
      },
    ];

    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

export const getCitizenRegistrations = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 23, 1);

    const registrations = await Patient.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          label: {
            $concat: [
              { $toString: "$_id.month" },
              "/",
              { $toString: "$_id.year" },
            ],
          },
          value: "$count",
          _id: 0,
        },
      },
    ]);

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching citizen registrations:", error);
    res.status(500).json({ error: "Failed to fetch citizen registrations" });
  }
};

export const getYearlyRegistrations = async (req, res) => {
  try {
    const now = new Date();
    const startYear = now.getFullYear() - 4;

    const registrations = await Patient.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startYear, 0, 1), $lte: now },
        },
      },
      {
        $group: {
          _id: { $year: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: { $toString: "$_id" },
          value: "$count",
          _id: 0,
        },
      },
    ]);

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching yearly registrations:", error);
    res.status(500).json({ error: "Failed to fetch yearly registrations" });
  }
};

export const getRegistrationsByProvince = async (req, res) => {
  try {
    const { endDate } = req.query;
    let matchStage = {};
    if (endDate) {
      const [year, month] = endDate.split("-").map(Number);
      const end = new Date(Date.UTC(year, month, 1));
      const start = new Date(Date.UTC(year, month - 12, 1));
      matchStage = { createdAt: { $gte: start, $lt: end } };
    }

    const districtCounts = await Patient.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$district",
          count: { $sum: 1 },
        },
      },
    ]);

    // map districts to provinces
    const provinceCounts = {};
    districtCounts.forEach(({ _id: district, count }) => {
      const province = districtToProvince[district] || "Unknown";
      if (province !== "Unknown") {
        provinceCounts[province] = (provinceCounts[province] || 0) + count;
      } else {
        console.warn(`Unmapped district: ${district}, count: ${count}`);
      }
    });

    // format as api
    const registrations = Object.entries(provinceCounts)
      .map(([province, count]) => ({
        label: province,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations by province:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch registrations by province" });
  }
};

export const getVaccinationRecordsByProvince = async (req, res) => {
  try {
    const { year } = req.query;
    let matchStage = {};
    if (year) {
      const start = new Date(year, 0, 1);
      const end = new Date(Number(year) + 1, 0, 1);
      matchStage = { createdAt: { $gte: start, $lt: end } };
    }

    const districtCounts = await VaccinationRecord.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "patients", // coll patient model
          localField: "citizenId",
          foreignField: "citizenId",
          as: "patientData",
        },
      },
      {
        $unwind: {
          path: "$patientData",
          preserveNullAndEmptyArrays: false, // excl records that no patients
        },
      },
      {
        $group: {
          _id: "$patientData.district",
          count: { $sum: 1 },
        },
      },
    ]);

    // map districts to provinces
    const provinceCounts = {};
    districtCounts.forEach(({ _id: district, count }) => {
      const province = districtToProvince[district] || "Unknown";
      if (province !== "Unknown") {
        provinceCounts[province] = (provinceCounts[province] || 0) + count;
      } else {
        console.warn(
          `Unmapped district in vaccination records: ${district}, count: ${count}`
        );
      }
    });

    // format as api
    const records = Object.entries(provinceCounts)
      .map(([province, count]) => ({
        label: province,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);

    res.json(records);
  } catch (error) {
    console.error("Error fetching vaccination records by province:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch vaccination records by province" });
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
    patients.forEach((p) => {
      patientMap.set(p.citizenId, {
        firstName: p.firstName,
        lastName: p.lastName,
        district: p.district,
        division: p.division,
      });
    });

    const vaccines = await Vaccine.find(
      {},
      { vaccineId: 1, name: 1, _id: 0 }
    ).lean();
    const vaccineNameById = new Map(vaccines.map((v) => [v.vaccineId, v.name]));

    const payload = { mode: "latest", events: [] };

    for (const patient of patients) {
      const vaccinations = await VaccinationRecord.find(
        { citizenId: patient.citizenId },
        {
          vaccineId: 1,
          createdAt: 1,
          vaccinationLocation: 1,
          recordedBy: 1,
          _id: 0,
        }
      )
        .sort({ createdAt: 1 })
        .lean();

      // Build patient object for FastAPI payload
      const patientData = {
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

      // Add vaccination details dynamically
      vaccinations.forEach((vax, index) => {
        const slot = index + 1;
        const vaccineName = vaccineNameById.get(vax.vaccineId) || null;
        patientData[`v${slot}Code`] = vaccineName;
        patientData[`v${slot}Date`] = vax.createdAt
          ? vax.createdAt.toISOString().split("T")[0]
          : null;
        patientData[`v${slot}Location`] = vax.vaccinationLocation || null;
        patientData[`v${slot}HcpId`] = vax.recordedBy?.id || null;
      });

      payload.events.push(patientData);
    }

    // call fastAPI
    const fastApiUrl = `${process.env.FAST_API_URL}/score`;
    const response = await fetch(fastApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`FastAPI error: ${response.statusText}`);

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

    const mapRiskData = (arr) =>
      arr.map((r) => ({
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
    console.error("Error in api:", error);
    res.status(500).json({ error: "Failed to fetch risk" });
  }
};
