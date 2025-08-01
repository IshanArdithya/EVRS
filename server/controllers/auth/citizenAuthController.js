import Citizen from "../../models/patientModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginCitizen = async (req, res) => {
  const { citizenId, password } = req.body;

  if (!citizenId || !password) {
    return res
      .status(400)
      .json({ message: "Citizen ID and password are required" });
  }

  try {
    const citizen = await Citizen.findOne({ citizenId });

    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    const isMatch = await bcrypt.compare(password, citizen.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { citizenId: citizen.citizenId, role: "citizen" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("citizen_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      citizen: {
        citizenId: citizen.citizenId,
        firstName: citizen.firstName,
        lastName: citizen.lastName,
      },
    });
  } catch (error) {
    console.error("Citizen login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutCitizen = (req, res) => {
  res.clearCookie("citizen_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getCitizenProfile = async (req, res) => {
  const token = req.cookies.citizen_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { citizenId } = payload;

    const citizen = await Citizen.findOne({ citizenId })
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
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp,
      },
    });
  } catch (err) {
    console.error("getCitizenProfile error:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
