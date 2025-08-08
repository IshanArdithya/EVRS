import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendMail } from "../services/mailer.js";
import Citizen from "../models/patientModel.js";
import HCP from "../models/hcpModel.js";
import Hospital from "../models/hospitalModel.js";
import MOH from "../models/mohModel.js";
import Admin from "../models/adminModel.js";
import { buildResetUrl } from "../helpers/resetUrl.js";

const RoleModel = {
  citizen: Citizen,
  hcp: HCP,
  hospital: Hospital,
  moh: MOH,
  admin: Admin,
};

const RoleIdField = {
  citizen: "citizenId",
  hcp: "hcpId",
  hospital: "hospitalId",
  moh: "mohId",
  admin: "adminId",
};

export async function forgotPassword(req, res) {
  const { id, role } = req.body;
  if (!id || !role || !RoleModel[role]) {
    return res.status(400).json({ message: "ID and valid role are required." });
  }

  const Model = RoleModel[role];
  const idField = RoleIdField[role];

  const user = await Model.findOne({ [idField]: id });

  if (!user) {
    // no reveal whether id exists
    return res.json({
      message: "If that account exists, a reset link has been sent.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 3600 * 1000;
  user.resetPassword = { token, expires };
  await user.save();

  const resetUrl = buildResetUrl(role, token);
  await sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>We received a request to reset your password. Click <a href="${resetUrl}">here</a> to choose a new one. This link expires in one hour.</p>`,
  });

  return res.json({
    message: "If that account exists, a reset link has been sent.",
  });
}

export async function resetPassword(req, res) {
  const { role, token, newPassword } = req.body;
  if (!role || !token || !newPassword || !RoleModel[role]) {
    return res
      .status(400)
      .json({ message: "role, token & newPassword are required." });
  }

  const Model = RoleModel[role];
  const user = await Model.findOne({
    "resetPassword.token": token,
    "resetPassword.expires": { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetPassword = undefined;
  await user.save();

  return res.json({ message: "Your password has been reset." });
}
