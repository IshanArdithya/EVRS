import MOH from "../../models/mohModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginMOH = async (req, res) => {
  const { mohId, password } = req.body;

  if (!mohId || !password) {
    return res
      .status(400)
      .json({ message: "MOH ID and password are required" });
  }

  try {
    const moh = await MOH.findOne({ mohId });

    if (!moh) {
      return res.status(404).json({ message: "MOH not found" });
    }

    const isMatch = await bcrypt.compare(password, moh.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { mohId: moh.mohId, role: "moh" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("moh_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      token,
      moh: {
        mohId: moh.mohId,
        name: moh.name,
        email: moh.email,
        contactNumber: moh.contactNumber,
        district: moh.district,
        province: moh.province,
      },
    });
  } catch (error) {
    console.error("MOH login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutMOH = (req, res) => {
  res.clearCookie("moh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
