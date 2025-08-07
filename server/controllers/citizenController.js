import bcrypt from "bcryptjs";
import { transporter } from "../utils/mailer.js";
import { twilioClient } from "../config/twilio.js";
import Patient from "../models/patientModel.js";
import VaccinationRecord from "../models/vaccinationModel.js";
import Vaccine from "../models/vaccineModel.js";
import HealthcareProvider from "../models/hcpModel.js";
import Hospital from "../models/hospitalModel.js";
import MOH from "../models/mohModel.js";

export const getCitizenVaccinations = async (req, res) => {
  const citizenId = req.user.citizenId;
  const { limit } = req.query;

  try {
    const patient = await Patient.findOne({ citizenId })
      .select("firstName lastName")
      .lean();
    if (!patient) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    let query = VaccinationRecord.find({ citizenId }).sort({ createdAt: -1 });

    if (limit && Number(limit) > 0) {
      query = query.limit(parseInt(limit, 10));
    }

    const records = await query.lean();

    // batchload vaccine info
    const vaccineIds = [...new Set(records.map((r) => r.vaccineId))];
    const vaccines = await Vaccine.find({ vaccineId: { $in: vaccineIds } })
      .select("vaccineId name sideEffects")
      .lean();
    const vacMap = Object.fromEntries(vaccines.map((v) => [v.vaccineId, v]));

    // batchload vaccinators by role
    const byRole = records.reduce((acc, r) => {
      acc[r.recordedBy.role] ||= new Set();
      acc[r.recordedBy.role].add(r.recordedBy.id);
      return acc;
    }, {});

    // fetch each group
    const [hcps, hospitals, mohs] = await Promise.all([
      HealthcareProvider.find({ hcpId: { $in: [...(byRole.hcp || [])] } })
        .select("hcpId fullName")
        .lean(),
      Hospital.find({ hospitalId: { $in: [...(byRole.hospital || [])] } })
        .select("hospitalId name")
        .lean(),
      MOH.find({ mohId: { $in: [...(byRole.moh || [])] } })
        .select("mohId name")
        .lean(),
    ]);

    // build lookup maps
    const hcpMap = Object.fromEntries(hcps.map((h) => [h.hcpId, h.fullName]));
    const hospitalMap = Object.fromEntries(
      hospitals.map((h) => [h.hospitalId, h.name])
    );
    const mohMap = Object.fromEntries(mohs.map((m) => [m.mohId, m.name]));

    // enrich each rec
    const enriched = records.map((r) => {
      let adminName = "";
      switch (r.recordedBy.role) {
        case "hcp":
          adminName = hcpMap[r.recordedBy.id] || r.recordedBy.id;
          break;
        case "hospital":
          adminName = hospitalMap[r.recordedBy.id] || r.recordedBy.id;
          break;
        case "moh":
          adminName = mohMap[r.recordedBy.id] || r.recordedBy.id;
          break;
      }

      const vac = vacMap[r.vaccineId] || {};
      return {
        vaccinationId: r.vaccinationId,
        vaccineName: vac.name || "Unknown",
        sideEffects: vac.sideEffects || "",
        date: r.createdAt,
        location: r.vaccinationLocation,
        administrator: adminName,
        administratorRole: r.recordedBy.role,
        batchNumber: r.batchNumber,
        notes: r.additionalNotes,
      };
    });

    return res.status(200).json({
      citizen: {
        fullName: `${patient.firstName} ${patient.lastName}`,
        citizenId,
      },
      records: enriched,
    });
  } catch (err) {
    console.error("Citizen vaccinations error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCitizenProfile = async (req, res) => {
  const citizenId = req.user.citizenId;
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Address can't be empty" });
  }

  try {
    const updated = await Patient.findOneAndUpdate(
      { citizenId },
      {
        ...(address && { address }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----- Profile Settings Section -----

function genCode() {
  return ("" + Math.floor(100000 + Math.random() * 900000)).slice(0, 6);
}

const OTP_TTL_MS = 10 * 60 * 1000;

export const requestEmailChange = async (req, res) => {
  const { newEmail } = req.body;
  const { citizenId } = req.user;

  if (!newEmail) {
    return res.status(400).json({ message: "New email is required" });
  }

  // gen 6 digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const expires = new Date(Date.now() + OTP_TTL_MS);
    await Patient.findOneAndUpdate(
      { citizenId },
      {
        pendingEmail: { address: newEmail, code, expires },
      }
    );

    await transporter.sendMail({
      from: `"EVRS Support" <no-reply@evrs.gov>`,
      to: newEmail,
      subject: "Your EVRS Email Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>
                <p>This code will expire in 10 minutes.</p>`,
    });

    res.json({ message: "Verification code sent to new email" });
  } catch (err) {
    console.error("requestEmailChange error:", err);
    res.status(500).json({ message: "Failed to send verification code" });
  }
};

export const verifyEmailChange = async (req, res) => {
  const { code } = req.body;
  const { citizenId } = req.user;

  if (!code) {
    return res.status(400).json({ message: "Verification code is required" });
  }

  try {
    const patient = await Patient.findOne({ citizenId });

    if (!patient || !patient.pendingEmail.code) {
      return res.status(404).json({ message: "No pending email change found" });
    }

    const { address, code: expectedCode, expires } = patient.pendingEmail;

    if (new Date() > expires) {
      return res.status(410).json({ message: "Verification code expired" });
    }
    if (code !== expectedCode) {
      return res.status(401).json({ message: "Invalid verification code" });
    }

    patient.email = address;

    patient.pendingEmail = { address: "", code: "", expires: null };
    await patient.save();

    res.json({ message: "Email updated successfully", email: patient.email });
  } catch (err) {
    console.error("verifyEmailChange error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const requestPhoneChange = async (req, res) => {
  const citizenId = req.user.citizenId;
  const { newPhone } = req.body;
  if (!newPhone) {
    return res.status(400).json({ message: "newPhone is required" });
  }

  // dupli check
  const exists = await Patient.findOne({ phoneNumber: newPhone });
  if (exists) {
    return res.status(409).json({ message: "Phone already in use" });
  }

  const code = genCode();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // store pendingPhone
  const updated = await Patient.findOneAndUpdate(
    { citizenId },
    { pendingPhone: { number: newPhone, code, expires } },
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ message: "Citizen not found" });
  }

  try {
    await twilioClient.messages.create({
      body: `Your EVRS verification code is ${code}. It expires in 15 minutes.`,
      from: process.env.TWILIO_WHATSAPP_SANDBOX_NUMBER,
      to: `whatsapp:${newPhone}`,
    });

    return res.json({ message: "Verification code sent via WhatsApp" });
  } catch (err) {
    console.error("Twilio WhatsApp error:", err);
    return res.status(500).json({ message: "Failed to send WhatsApp OTP" });
  }
};

export const verifyPhoneChange = async (req, res) => {
  const citizenId = req.user.citizenId;
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: "code is required" });
  }

  const user = await Patient.findOne({ citizenId }).select("pendingPhone");
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

export const updateMedicalInfo = async (req, res) => {
  const { citizenId } = req.user;
  const { bloodType, allergies, medicalConditions, emergencyContact } =
    req.body;

  if (
    bloodType == null &&
    allergies == null &&
    medicalConditions == null &&
    emergencyContact == null
  ) {
    return res.status(400).json({
      message:
        "Provide at least one of: bloodType, allergies, medicalConditions, emergencyContact",
    });
  }

  const update = {};
  if (bloodType) update.bloodType = bloodType;
  if (allergies) {
    update.allergies = Array.isArray(allergies)
      ? allergies
      : allergies
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
  }
  if (medicalConditions) {
    update.medicalConditions = Array.isArray(medicalConditions)
      ? medicalConditions
      : medicalConditions
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
  }
  if (emergencyContact) {
    const { name, phoneNumber } = emergencyContact;
    if (!name || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Emergency contact requires name & phoneNumber" });
    }
    update.emergencyContact = { name, phoneNumber };
  }

  try {
    const updated = await Patient.findOneAndUpdate({ citizenId }, update, {
      new: true,
    }).select("bloodType allergies medicalConditions emergencyContact");

    if (!updated) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.json({
      message: "Medical information updated",
      medical: {
        bloodType: updated.bloodType,
        allergies: updated.allergies,
        medicalConditions: updated.medicalConditions,
        emergencyContact: updated.emergencyContact,
      },
    });
  } catch (err) {
    console.error("updateMedicalInfo error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export async function changePassword(req, res) {
  const { citizenId } = req.user;
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
    const patient = await Patient.findOne({ citizenId }).select("password");
    if (!patient) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const sameAsOld = await bcrypt.compare(newPassword, patient.password);
    if (sameAsOld) {
      return res
        .status(400)
        .json({ message: "New password must be different from current" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    patient.password = hashed;
    await patient.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export const getCitizenProfile = async (req, res) => {
  const { citizenId } = req.user;

  try {
    const citizen = await Patient.findOne({ citizenId })
      .select("-password -pendingEmail -pendingPhone -__v")
      .lean();

    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    const formattedBirthDate = citizen.birthDate
      ? citizen.birthDate.toISOString().split("T")[0]
      : null;

    return res.status(200).json({
      loggedIn: true,
      citizen: {
        citizenId: citizen.citizenId,
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        email: citizen.email || null,
        phoneNumber: citizen.phoneNumber || null,
        address: citizen.address || null,
        birthDate: formattedBirthDate,
        bloodType: citizen.bloodType,
        allergies: citizen.allergies,
        medicalConditions: citizen.medicalConditions,
        emergencyContact: {
          name: citizen.emergencyContact?.name,
          phoneNumber: citizen.emergencyContact?.phoneNumber,
        },
      },
    });
  } catch (err) {
    console.error("getCitizenProfile error:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
