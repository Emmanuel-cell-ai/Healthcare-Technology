const jwt = require("jsonwebtoken");

function issueToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      contact: user.contact,
    },
    process.env.JWT_SECRET || "dev-secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
}

module.exports = { issueToken };
