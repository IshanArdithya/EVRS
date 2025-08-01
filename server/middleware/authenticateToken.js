import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const { citizen_token, hcp_token, hospital_token, moh_token } =
    req.cookies || {};

  const token = citizen_token || hcp_token || hospital_token || moh_token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}
