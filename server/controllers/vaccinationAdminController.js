import VaccinationRecord from "../models/vaccinationModel.js";

function generateVaccinationId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `VR${digits}`;
}

export const addVaccination = async (req, res) => {
  const {
    citizenId,
    vaccineId,
    batchNumber,
    expiryDate,
    healthcareProviderId,
    vaccinationLocation,
    division,
    additionalNotes,
  } = req.body;

  if (
    !citizenId ||
    !vaccineId ||
    !batchNumber ||
    !expiryDate ||
    !healthcareProviderId ||
    !vaccinationLocation ||
    !division
  ) {
    return res
      .status(400)
      .json({ message: "All fields except additionalNotes are required" });
  }

  try {
    const newRecord = await VaccinationRecord.create({
      vaccinationId: generateVaccinationId(),
      citizenId,
      vaccineId,
      batchNumber,
      expiryDate,
      healthcareProviderId,
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

export const getAllVaccinations = async (req, res) => {
  try {
    const records = await VaccinationRecord.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error("Get vaccinations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVaccinationsByCitizenId = async (req, res) => {
  const { citizenId } = req.params;

  try {
    const records = await VaccinationRecord.find({ citizenId }).sort({
      createdAt: -1,
    });

    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ message: "No vaccination records found for this citizen." });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error("Get citizen vaccinations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVaccinationById = async (req, res) => {
  const { vaccinationId } = req.params;

  try {
    const record = await VaccinationRecord.findOne({ vaccinationId });

    if (!record) {
      return res.status(404).json({ message: "Vaccination record not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("Get vaccination by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVaccinationById = async (req, res) => {
  const { vaccinationId } = req.params;
  const {
    vaccineId,
    batchNumber,
    expiryDate,
    healthcareProviderId,
    vaccinationLocation,
    division,
    additionalNotes,
  } = req.body;

  try {
    const record = await VaccinationRecord.findOne({ vaccinationId });

    if (!record) {
      return res.status(404).json({ message: "Vaccination record not found" });
    }

    record.vaccineId = vaccineId || record.vaccineId;
    record.batchNumber = batchNumber || record.batchNumber;
    record.expiryDate = expiryDate || record.expiryDate;
    record.healthcareProviderId =
      healthcareProviderId || record.healthcareProviderId;
    record.vaccinationLocation =
      vaccinationLocation || record.vaccinationLocation;
    record.division = division || record.division;
    record.additionalNotes =
      additionalNotes !== undefined ? additionalNotes : record.additionalNotes;

    const updated = await record.save();

    res.status(200).json({
      message: "Vaccination record updated successfully",
      record: updated,
    });
  } catch (error) {
    console.error("Update vaccination error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteVaccinationById = async (req, res) => {
  const { vaccinationId } = req.params;

  try {
    const deleted = await VaccinationRecord.findOneAndDelete({ vaccinationId });

    if (!deleted) {
      return res.status(404).json({ message: "Vaccination record not found" });
    }

    res
      .status(200)
      .json({ message: "Vaccination record deleted successfully" });
  } catch (error) {
    console.error("Delete vaccination error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
