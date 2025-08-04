import Hospital from "../../models/hospitalModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginHospital = async (req, res) => {
  const { hospitalId, password } = req.body;

  if (!hospitalId || !password) {
    return res
      .status(400)
      .json({ message: "Hospital ID and password are required" });
  }

  try {
    const hospital = await Hospital.findOne({ hospitalId });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { hospitalId: hospital.hospitalId, role: "hospital" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("hospital_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      token,
      hospital: {
        hospitalId: hospital.hospitalId,
        name: hospital.name,
        email: hospital.email,
        district: hospital.district,
        province: hospital.province,
      },
    });
  } catch (error) {
    console.error("Hospital login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutHospital = (req, res) => {
  res.clearCookie("hospital_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getHospitalProfile = async (req, res) => {
  const token = req.cookies.hospital_token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { hospitalId } = payload;

    const hospital = await Hospital.findOne({ hospitalId })
      .select("-password -pendingEmail -pendingPhone -__v")
      .lean();

    if (!hospital) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.status(200).json({
      loggedIn: true,
      hospital: {
        hospitalId: hospital.hospitalId,
        name: hospital.name,
        email: hospital.email,
        phoneNumber: hospital.phoneNumber,
        province: hospital.province,
        district: hospital.district,
      },
    });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
