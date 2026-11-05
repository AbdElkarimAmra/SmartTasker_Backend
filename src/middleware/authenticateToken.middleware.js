// src/middleware/authenticateToken.js
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log("------------ AUTH DEBUG ------------");
  console.log("[AUTH] header present:", !!authHeader);
  console.log("[AUTH] token present:", !!token);
  console.log("[AUTH] JWT_SECRET len:", (process.env.JWT_SECRET || "").length);

  if (!token) {
    console.log("[AUTH] ❌ No token supplied");
    return res.status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  // ✅ normalize: make _id available even if the token uses `sub`
  if (user?.sub && !user._id) user._id = user.sub;

  req.user = user;
  next();
});
};

module.exports = authenticateToken;
