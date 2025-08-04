import jwt from "jsonwebtoken";
export function authenticateMOH(req, res, next) {
  const token = req.cookies?.moh_token;
  if (!token) return res.status(401).json({ message: "No moh token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "moh")
      return res.status(403).json({ message: "Not a MOH" });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
