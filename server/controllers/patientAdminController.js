import bcrypt from "bcryptjs";
import crypto from "crypto";
import Patient from "../models/patientModel.js";

function generateCitizenId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `C${digits}`;
}

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

export const registerPatient = async (req, res) => {
  const {
    serialNumber,
    firstName,
    lastName,
    birthDate,
    district,
    division,
    guardianNIC,
  } = req.body;

  try {
    if (
      !serialNumber ||
      !firstName ||
      !lastName ||
      !birthDate ||
      !district ||
      !division ||
      !guardianNIC
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

export const getPatientByCitizenId = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      citizenId: req.params.citizenId,
    }).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Get patient by citizenId error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePatientByCitizenId = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      district,
      division,
      guardianNIC,
      phoneNumber,
      address,
    } = req.body;

    const patient = await Patient.findOne({ citizenId: req.params.citizenId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.firstName = firstName || patient.firstName;
    patient.lastName = lastName || patient.lastName;
    patient.birthDate = birthDate || patient.birthDate;
    patient.district = district || patient.district;
    patient.division = division || patient.division;
    patient.guardianNIC = guardianNIC || patient.guardianNIC;
    patient.phoneNumber = phoneNumber || patient.phoneNumber;
    patient.address = address || patient.address;

    const updated = await patient.save();

    res.status(200).json({
      message: "Patient updated successfully",
      patient: {
        id: updated._id,
        citizenId: updated.citizenId,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phoneNumber: updated.phoneNumber,
        address: updated.address,
      },
    });
  } catch (error) {
    console.error("Update patient error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePatientByCitizenId = async (req, res) => {
  try {
    const deletedPatient = await Patient.findOneAndDelete({
      citizenId: req.params.citizenId,
    });

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Delete patient error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const { district, division, search } = req.query;

    const filter = {};

    if (district) {
      filter.district = district;
    }

    if (division) {
      filter.division = { $regex: new RegExp(division, "i") };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { patientId: regex },
        { district: regex },
        { division: regex },
      ];
    }

    const patients = await Patient.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Get all patients error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
