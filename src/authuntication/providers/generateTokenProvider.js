
const jwt = require("jsonwebtoken");

function generateTokenProvider(user) {
  const secret = process.env.JWT_SECRET;

  const expirationSeconds = Number(
    process.env.JWT_ACCESS_EXPIRATION_TIME
  );

  // Verify JWT configuration
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  if (
    !Number.isSafeInteger(expirationSeconds) ||
    expirationSeconds <= 0
  ) {
    throw new Error(
      "JWT_ACCESS_EXPIRATION_TIME must be a positive number of seconds"
    );
  }

  // Generate the JWT
  const payload = {
    sub: String(user.id),
    email: user.email
  };

  return jwt.sign(payload, secret, {
    expiresIn: expirationSeconds
  });
}

module.exports = generateTokenProvider;
