import jwt from "jsonwebtoken";
export function authenticateHCP(req, res, next) {
  const token = req.cookies?.hcp_token;
  if (!token) return res.status(401).json({ message: "No hcp token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "hcp")
      return res.status(403).json({ message: "Not a healthcare provider" });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
