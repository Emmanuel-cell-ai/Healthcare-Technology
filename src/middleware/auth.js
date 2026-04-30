const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this resource." });
    }

    return next();
  };
}

module.exports = { requireAuth, requireRole };
