import Vaccine from "../models/vaccineModel.js";

function generateVaccineId() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `VAC${digits}`;
}

export const registerVaccine = async (req, res) => {
  const { name, sideEffects } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Vaccine name is required" });
  }

  try {
    const existing = await Vaccine.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Vaccine already exists" });
    }

    const newVaccine = await Vaccine.create({
      vaccineId: generateVaccineId(),
      name,
      sideEffects: sideEffects || "",
    });

    res.status(201).json({
      message: "Vaccine registered successfully",
      vaccine: newVaccine,
    });
  } catch (error) {
    console.error("Register vaccine error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find().sort({ createdAt: -1 });
    res.status(200).json(vaccines);
  } catch (error) {
    console.error("Get vaccines error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVaccineById = async (req, res) => {
  const { vaccineId } = req.params;

  try {
    const vaccine = await Vaccine.findOne({ vaccineId });

    if (!vaccine) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    res.status(200).json(vaccine);
  } catch (error) {
    console.error("Get vaccine by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVaccineById = async (req, res) => {
  const { vaccineId } = req.params;
  const { name, sideEffects } = req.body;

  try {
    const vaccine = await Vaccine.findOne({ vaccineId });

    if (!vaccine) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    vaccine.name = name || vaccine.name;
    vaccine.sideEffects =
      sideEffects !== undefined ? sideEffects : vaccine.sideEffects;

    const updated = await vaccine.save();

    res.status(200).json({
      message: "Vaccine updated successfully",
      vaccine: updated,
    });
  } catch (error) {
    console.error("Update vaccine error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteVaccineById = async (req, res) => {
  const { vaccineId } = req.params;

  try {
    const deleted = await Vaccine.findOneAndDelete({ vaccineId });

    if (!deleted) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    res.status(200).json({ message: "Vaccine deleted successfully" });
  } catch (error) {
    console.error("Delete vaccine error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
