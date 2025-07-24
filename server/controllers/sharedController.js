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

export const addVaccination = async (req, res) => {
  const {
    citizenId,
    vaccineId,
    batchNumber,
    expiryDate,
    recordedById,
    recordedByRole,
    vaccinationLocation,
    division,
    additionalNotes,
  } = req.body;

  if (
    !citizenId ||
    !vaccineId ||
    !batchNumber ||
    !expiryDate ||
    !recordedById ||
    !recordedByRole ||
    !vaccinationLocation ||
    !division
  ) {
    return res.status(400).json({
      message: "All fields except additionalNotes are required",
    });
  }

  try {
    const newRecord = await VaccinationRecord.create({
      vaccinationId: generateVaccinationId(),
      citizenId,
      vaccineId,
      batchNumber,
      expiryDate,
      recordedBy: {
        id: recordedById,
        role: recordedByRole,
      },
      vaccinationLocation,
      division,
      additionalNotes: additionalNotes || "",
    });

    res.status(201).json({
      message: "Vaccination record created successfully",
      record: newRecord,
    });
  } catch (error) {
    console.error("Add vaccination error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerPatient = async (req, res) => {
  const {
    serialNumber,
    firstName,
    lastName,
    birthDate,
    district,
    division,
    guardianNIC,
    recordedBy,
  } = req.body;

  try {
    if (
      !serialNumber ||
      !firstName ||
      !lastName ||
      !birthDate ||
      !district ||
      !division ||
      !guardianNIC ||
      !recordedBy?.id ||
      !recordedBy?.role
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Patient.findOne({ serialNumber });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Patient with this serial number already exists" });
    }

    const rawPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newPatient = await Patient.create({
      citizenId: generateCitizenId(),
      serialNumber,
      firstName,
      lastName,
      birthDate,
      district,
      division,
      guardianNIC,
      password: hashedPassword,
      recordedBy: {
        id: recordedBy.id,
        role: recordedBy.role,
      },
    });

    res.status(201).json({
      message: "Patient registered successfully",
      patient: {
        id: newPatient._id,
        citizenId: newPatient.citizenId,
        firstName: newPatient.firstName,
        lastName: newPatient.lastName,
        email: newPatient.email,
        password: rawPassword,
      },
    });
  } catch (error) {
    console.error("Register patient error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
