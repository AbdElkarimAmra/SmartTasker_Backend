
const { StatusCodes } = require("http-status-codes");
const { matchedData } = require("express-validator");
const bcrypt = require("bcrypt");

const getUserByEmail = require("../../Users/providers/getUserByEmail");
const generateTokenProvider = require("./generateTokenProvider");

async function loginProvider(req, res) {
  try {
    // 1. Get validated input
    const { email, password } = matchedData(req);

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reason: "Email and password are required"
      });
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find the user
    const user = await getUserByEmail(normalizedEmail);

    console.log("[login] User found:", !!user);

    // 4. Handle a missing user
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reason: "Invalid email or password"
      });
    }

    // 5. Verify stored password hash exists
    if (!user.password) {
      console.error("[login] User password hash missing");

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        reason: "Unable to process login"
      });
    }

    // 6. Compare passwords
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reason: "Invalid email or password"
      });
    }

    // 7. Generate authentication token
    const token = await generateTokenProvider(user);

    // 8. Return successful login response
    return res.status(StatusCodes.OK).json({
      accessToken: token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });

  } catch (error) {
    console.error("[login] Error type:", error.name);
    console.error("[login] Error message:", error.message);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      reason: "Unable to process login"
    });
  }
}

module.exports = loginProvider;
