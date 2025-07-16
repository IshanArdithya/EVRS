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

    res.status(200).json({
      message: "Login successful",
      token,
      hospital: {
        hospitalId: hospital.hospitalId,
        name: hospital.hospitalName,
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
