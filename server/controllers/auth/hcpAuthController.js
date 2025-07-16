import HCP from "../../models/hcpModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginHCP = async (req, res) => {
  const { hcpId, password } = req.body;

  if (!hcpId || !password) {
    return res
      .status(400)
      .json({ message: "HCP ID and password are required" });
  }

  try {
    const hcp = await HCP.findOne({ hcpId });

    if (!hcp) {
      return res.status(404).json({ message: "Healthcare Provider not found" });
    }

    const isMatch = await bcrypt.compare(password, hcp.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { hcpId: hcp.hcpId, role: "hcp" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      hcp: {
        hcpId: hcp.hcpId,
        fullName: hcp.fullName,
        role: hcp.role,
      },
    });
  } catch (error) {
    console.error("HCP login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
