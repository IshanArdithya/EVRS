import jwt from "jsonwebtoken";

export function authenticateRole(roleName) {
  const cookieName = `${roleName}_token`;
  return (req, res, next) => {
    const token =
      req.cookies?.[cookieName] || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
}

// check roles
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
