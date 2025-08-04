import jwt from "jsonwebtoken";
export function authenticateCitizen(req, res, next) {
  const token = req.cookies?.citizen_token;
  if (!token) return res.status(401).json({ message: "No citizen token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "citizen")
      return res.status(403).json({ message: "Not a citizen" });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
