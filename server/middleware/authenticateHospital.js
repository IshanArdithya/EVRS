import jwt from "jsonwebtoken";
export function authenticateHospital(req, res, next) {
  const token = req.cookies?.hospital_token;
  if (!token) return res.status(401).json({ message: "No hospital token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "hospital")
      return res.status(403).json({ message: "Not a Hospital" });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
