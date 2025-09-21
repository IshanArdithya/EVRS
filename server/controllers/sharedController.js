import bcrypt from "bcryptjs";
import crypto from "crypto";
import Vaccine from "../models/vaccineModel.js";
import Patient from "../models/patientModel.js";
import VaccinationRecord from "../models/vaccinationModel.js";

function generateVaccinationId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `VR${digits}`;
}

function generateCitizenId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `C${digits}`;
}

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

export const getAllVaccines = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ vaccineId: regex }, { name: regex }];
    }

    const vaccines = await Vaccine.find(filter).sort({ createdAt: -1 });

    res.status(200).json(vaccines);
  } catch (error) {
    console.error("Get all vaccines error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVaccinationsByCitizenId = async (req, res) => {
  const { citizenId } = req.params;

  try {
    // fetch patient info
    const patient = await Patient.findOne({ citizenId })
      .select("firstName lastName birthDate citizenId")
      .lean();

    if (!patient) {
      return res.status(404).json({ message: "Citizen not found." });
    }

    // fetch vaccination records
    const records = await VaccinationRecord.find({ citizenId })
      .sort({ createdAt: -1 })
      .lean();

    if (!records || records.length === 0) {
      return res.status(404).json({
        message: "No vaccination records found for this citizen.",
        patient,
      });
    }

    // get all vaccineIds and fetch their names
    const vaccineIds = [...new Set(records.map((r) => r.vaccineId))];
    const vaccines = await Vaccine.find({ vaccineId: { $in: vaccineIds } })
      .select("vaccineId name")
      .lean();

    const vaccineMap = Object.fromEntries(
      vaccines.map((v) => [v.vaccineId, v.name])
    );

    // append vaccine name to each record
    const enrichedRecords = records.map((record) => ({
      ...record,
      vaccineName: vaccineMap[record.vaccineId] || "Unknown",
    }));

    res.status(200).json({
      patient,
      records: enrichedRecords,
    });
  } catch (error) {
    console.error("Get citizen vaccinations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStats = async (req, res) => {
  try {
    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // patients stats
    const totalPatients = await Patient.countDocuments();
    const totalPatientsLastMonth = await Patient.countDocuments({
      createdAt: { $lt: currentMonthStart },
    });
    const additionsPatients = totalPatients - totalPatientsLastMonth;
    let growthPatients = 0;
    if (totalPatientsLastMonth > 0) {
      growthPatients = (additionsPatients / totalPatientsLastMonth) * 100;
    } else if (additionsPatients > 0) {
      growthPatients = 100;
    }
    const changePatients = `${
      growthPatients >= 0 ? "+" : ""
    }${growthPatients.toFixed(1)}%`;

    // vaccines stats
    const totalVaccines = await Vaccine.countDocuments();
    const totalVaccinesLastMonth = await Vaccine.countDocuments({
      createdAt: { $lt: currentMonthStart },
    });
    const additionsVaccines = totalVaccines - totalVaccinesLastMonth;
    let growthVaccines = 0;
    if (totalVaccinesLastMonth > 0) {
      growthVaccines = (additionsVaccines / totalVaccinesLastMonth) * 100;
    } else if (additionsVaccines > 0) {
      growthVaccines = 100;
    }
    const changeVaccines = `${
      growthVaccines >= 0 ? "+" : ""
    }${growthVaccines.toFixed(1)}%`;

    // vaccinations stats
    const totalVaccinations = await VaccinationRecord.countDocuments();
    const totalVaccinationsLastMonth = await VaccinationRecord.countDocuments({
      createdAt: { $lt: currentMonthStart },
    });
    const additionsVaccinations =
      totalVaccinations - totalVaccinationsLastMonth;
    let growthVaccinations = 0;
    if (totalVaccinationsLastMonth > 0) {
      growthVaccinations =
        (additionsVaccinations / totalVaccinationsLastMonth) * 100;
    } else if (additionsVaccinations > 0) {
      growthVaccinations = 100;
    }
    const changeVaccinations = `${
      growthVaccinations >= 0 ? "+" : ""
    }${growthVaccinations.toFixed(1)}%`;

    const stats = [
      {
        value: totalPatients.toString(),
        change: changePatients,
      },
      {
        value: totalVaccines.toString(),
        change: changeVaccines,
      },
      {
        value: totalVaccinations.toString(),
        change: changeVaccinations,
      },
    ];

    res.status(200).json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
