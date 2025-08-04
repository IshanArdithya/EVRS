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

    res.cookie("hcp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      token,
      hcp: {
        hcpId: hcp.hcpId,
        fullName: hcp.fullName,
        role: hcp.role,
        email: hcp.email,
      },
    });
  } catch (error) {
    console.error("HCP login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutHCP = (req, res) => {
  res.clearCookie("hcp_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getHCPProfile = async (req, res) => {
  const token = req.cookies.hcp_token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { hcpId } = payload;

    const hcp = await HCP.findOne({ hcpId })
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
