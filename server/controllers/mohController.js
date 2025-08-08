import bcrypt from "bcryptjs";
import { sendWhatsAppOTP } from "../services/twilio.js";
import MOH from "../models/mohModel.js";

// ----- Profile Settings Section -----

function genCode() {
  return ("" + Math.floor(100000 + Math.random() * 900000)).slice(0, 6);
}

export const requestPhoneChange = async (req, res) => {
  const mohId = req.user.mohId;
  const { newPhone } = req.body;
  if (!newPhone) {
    return res.status(400).json({ message: "newPhone is required" });
  }

  // dupli check
  const exists = await MOH.findOne({ phoneNumber: newPhone });
  if (exists) {
    return res.status(409).json({ message: "Phone already in use" });
  }

  const code = genCode();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // store pendingPhone
  const updated = await MOH.findOneAndUpdate(
    { mohId },
    { pendingPhone: { number: newPhone, code, expires } },
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ message: "Citizen not found" });
  }

  try {
    await sendWhatsAppOTP(newPhone, code);

    return res.json({ message: "Verification code sent via WhatsApp" });
  } catch (err) {
    console.error("WhatsApp send failed:", err?.code, err?.message);
    return res.status(500).json({ message: "Failed to send WhatsApp OTP" });
  }
};

export const verifyPhoneChange = async (req, res) => {
  const mohId = req.user.mohId;
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: "code is required" });
  }

  const user = await MOH.findOne({ mohId }).select("pendingPhone");
  if (!user || !user.pendingPhone) {
    return res.status(400).json({ message: "No pending phone change" });
  }

  const { number, code: savedCode, expires } = user.pendingPhone;
  if (new Date() > expires) {
    return res.status(400).json({ message: "Verification code expired" });
  }
  if (code !== savedCode) {
    return res.status(400).json({ message: "Invalid verification code" });
  }

  user.phoneNumber = number;
  user.pendingPhone = undefined;
  await user.save();

  res.json({
    message: "Phone number updated successfully",
    phone: user.phoneNumber,
  });
};

export async function changePassword(req, res) {
  const { mohId } = req.user;
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
    const moh = await MOH.findOne({ mohId }).select("password");
    if (!moh) {
      return res.status(404).json({ message: "MOH not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, moh.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const sameAsOld = await bcrypt.compare(newPassword, moh.password);
    if (sameAsOld) {
      return res
        .status(400)
        .json({ message: "New password must be different from current" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    moh.password = hashed;
    await moh.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export const addVaccination = async (req, res) => {
  const {
    citizenId,
    vaccineId,
    batchNumber,
    expiryDate,
    vaccinationLocation,
    division,
    additionalNotes,
  } = req.body;
  const { adminId, role } = req.user;

  if (
    !citizenId ||
    !vaccineId ||
    !batchNumber ||
    !expiryDate ||
    !adminId ||
    !role ||
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
        id: adminId,
        role: role,
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
  } = req.body;
  const { mohId, role } = req.user;

  try {
    if (
      !serialNumber ||
      !firstName ||
      !lastName ||
      !birthDate ||
      !district ||
      !division ||
      !guardianNIC ||
      !mohId ||
      !role
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
        id: mohId,
        role: role,
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

export const getMOHProfile = async (req, res) => {
  const { mohId } = req.user;

  try {
    const moh = await MOH.findOne({ mohId })
      .select("-password -pendingEmail -pendingPhone -__v")
      .lean();

    if (!moh) {
      return res.status(404).json({ message: "MOH not found" });
    }

    res.status(200).json({
      loggedIn: true,
      moh: {
        mohId: moh.mohId,
        name: moh.name,
        email: moh.email,
        phoneNumber: moh.phoneNumber,
        province: moh.province,
        district: moh.district,
      },
    });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
