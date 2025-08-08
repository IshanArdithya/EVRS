import bcrypt from "bcryptjs";
import { sendMail } from "../services/mailer.js";
import { sendWhatsAppOTP } from "../services/twilio.js";
import HealthcareProvider from "../models/hcpModel.js";

// ----- Profile Settings Section -----

function genCode() {
  return ("" + Math.floor(100000 + Math.random() * 900000)).slice(0, 6);
}

const OTP_TTL_MS = 10 * 60 * 1000;

export const requestEmailChange = async (req, res) => {
  const { newEmail } = req.body;
  const { hcpId } = req.user;

  if (!newEmail) {
    return res.status(400).json({ message: "New email is required" });
  }

  // gen 6 digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const expires = new Date(Date.now() + OTP_TTL_MS);
    await HealthcareProvider.findOneAndUpdate(
      { hcpId },
      {
        pendingEmail: { address: newEmail, code, expires },
      }
    );

    await sendMail({
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
  const { hcpId } = req.user;

  if (!code) {
    return res.status(400).json({ message: "Verification code is required" });
  }

  try {
    const hcp = await HealthcareProvider.findOne({ hcpId });

    if (!hcp || !hcp.pendingEmail.code) {
      return res.status(404).json({ message: "No pending email change found" });
    }

    const { address, code: expectedCode, expires } = hcp.pendingEmail;

    if (new Date() > expires) {
      return res.status(410).json({ message: "Verification code expired" });
    }
    if (code !== expectedCode) {
      return res.status(401).json({ message: "Invalid verification code" });
    }

    hcp.email = address;

    hcp.pendingEmail = { address: "", code: "", expires: null };
    await hcp.save();

    res.json({ message: "Email updated successfully", email: hcp.email });
  } catch (err) {
    console.error("verifyEmailChange error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const requestPhoneChange = async (req, res) => {
  const hcpId = req.user.hcpId;
  const { newPhone } = req.body;
  if (!newPhone) {
    return res.status(400).json({ message: "newPhone is required" });
  }

  // dupli check
  const exists = await HealthcareProvider.findOne({ phoneNumber: newPhone });
  if (exists) {
    return res.status(409).json({ message: "Phone already in use" });
  }

  const code = genCode();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // store pendingPhone
  const updated = await HealthcareProvider.findOneAndUpdate(
    { hcpId },
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
  const hcpId = req.user.hcpId;
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: "code is required" });
  }

  const user = await HealthcareProvider.findOne({ hcpId }).select(
    "pendingPhone"
  );
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
  const { hcpId } = req.user;
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
    const hcp = await HealthcareProvider.findOne({ hcpId }).select("password");
    if (!hcp) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, hcp.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const sameAsOld = await bcrypt.compare(newPassword, hcp.password);
    if (sameAsOld) {
      return res
        .status(400)
        .json({ message: "New password must be different from current" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    hcp.password = hashed;
    await hcp.save();

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
  const { hcpId, role } = req.user;

  if (
    !citizenId ||
    !vaccineId ||
    !batchNumber ||
    !expiryDate ||
    !hcpId ||
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
        id: hcpId,
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

export const getHCPProfile = async (req, res) => {
  const { hcpId } = req.user;

  try {
    const hcp = await HealthcareProvider.findOne({ hcpId })
      .select("-password -pendingEmail -pendingPhone -__v")
      .lean();

    if (!hcp) {
      return res.status(404).json({ message: "Healthcare Provider not found" });
    }

    res.status(200).json({
      loggedIn: true,
      hcp: {
        hcpId: hcp.hcpId,
        fullName: hcp.fullName,
        email: hcp.email,
        phoneNumber: hcp.phoneNumber,
        role: hcp.role,
        nic: hcp.nic,
      },
    });
  } catch (error) {
    console.error("getHcpProfile error:", err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
