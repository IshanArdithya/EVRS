import bcrypt from "bcryptjs";
import { twilioClient } from "../config/twilio.js";
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
